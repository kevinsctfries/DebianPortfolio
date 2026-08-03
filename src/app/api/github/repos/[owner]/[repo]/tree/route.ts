import { kv } from "@vercel/kv";

const CACHE_TTL = 60 * 60 * 24;
const NEGATIVE_CACHE_TTL = 60 * 5;

type CachedTree = { tree: unknown[] };

export async function GET(context: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await context.params;

  const cacheKey = `github:${owner}:${repo}:tree`;

  try {
    const cached = await kv.get<CachedTree | { error: string }>(cacheKey);
    if (cached) {
      if ("error" in cached) {
        return new Response(cached.error, { status: 502 });
      }
      return Response.json(cached);
    }

    const headers: Record<string, string> = {
      "User-Agent": "debian-portfolio-app",
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );

    if (!repoRes.ok) {
      const status = repoRes.status === 404 ? 404 : 502;
      const message =
        repoRes.status === 403
          ? "GitHub rate limited. Try again later."
          : repoRes.status === 404
            ? `Repo ${owner}/${repo} not found.`
            : `GitHub API error: ${repoRes.status}`;

      await kv.set(cacheKey, { error: message }, { ex: NEGATIVE_CACHE_TTL });
      return new Response(message, { status });
    }

    const repoData = await repoRes.json();
    const branch = repoData.default_branch as string;

    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers },
    );

    if (!treeRes.ok) {
      const message = `Failed to fetch tree for ${owner}/${repo}@${branch}: ${treeRes.status}`;
      await kv.set(cacheKey, { error: message }, { ex: NEGATIVE_CACHE_TTL });
      return new Response(message, { status: 502 });
    }

    const data: CachedTree = await treeRes.json();

    await kv.set(cacheKey, data, { ex: CACHE_TTL });

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

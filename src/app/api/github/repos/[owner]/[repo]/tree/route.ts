const CACHE_SECONDS = 60 * 60 * 24; // 24h

export async function GET(
  _req: Request,
  context: { params: Promise<{ owner: string; repo: string }> },
) {
  const { owner, repo } = await context.params;

  const headers: Record<string, string> = {
    "User-Agent": "debian-portfolio-app",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, next: { revalidate: CACHE_SECONDS } },
    );

    if (!repoRes.ok) {
      const status = repoRes.status === 404 ? 404 : 502;
      const message =
        repoRes.status === 403
          ? "GitHub rate limited. Try again later."
          : repoRes.status === 404
            ? `Repo ${owner}/${repo} not found.`
            : `GitHub API error: ${repoRes.status}`;
      return new Response(message, { status });
    }

    const repoData = await repoRes.json();
    const branch = repoData.default_branch as string;

    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers, next: { revalidate: CACHE_SECONDS } },
    );

    if (!treeRes.ok) {
      return new Response(
        `Failed to fetch tree for ${owner}/${repo}@${branch}: ${treeRes.status}`,
        { status: 502 },
      );
    }

    const data = await treeRes.json();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

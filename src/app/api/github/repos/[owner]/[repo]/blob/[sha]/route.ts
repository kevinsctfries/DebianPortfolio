const CACHE_SECONDS = 60 * 60 * 24; // 24h
const MAX_BLOB_SIZE = 300_000; // ~300KB, guards against dumping huge/binary files into the terminal

export async function GET(
  _req: Request,
  context: { params: Promise<{ owner: string; repo: string; sha: string }> },
) {
  const { owner, repo, sha } = await context.params;

  const headers: Record<string, string> = {
    "User-Agent": "debian-portfolio-app",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
      { headers, next: { revalidate: CACHE_SECONDS } },
    );

    if (!res.ok) {
      const status = res.status === 404 ? 404 : 502;
      const message =
        res.status === 403
          ? "GitHub rate limited. Try again later."
          : res.status === 404
            ? "File not found."
            : `GitHub API error: ${res.status}`;
      return new Response(message, { status });
    }

    const data = await res.json();

    if (data.size > MAX_BLOB_SIZE) {
      return new Response(`File too large to display (${data.size} bytes).`, {
        status: 413,
      });
    }

    if (data.encoding !== "base64") {
      return new Response("Unsupported blob encoding", { status: 502 });
    }

    const content = Buffer.from(
      data.content.replace(/\n/g, ""),
      "base64",
    ).toString("utf-8");

    return Response.json({ content, size: data.size });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

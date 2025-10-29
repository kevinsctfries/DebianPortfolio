import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = context.params;
  const branch = "main";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    if (!res.ok) {
      console.error(`GitHub API fetch failed: ${res.status} ${res.statusText}`);
      return new Response("Failed to fetch repo", { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";

const CACHE_TTL = 60 * 60 * 24;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await context.params;
  const branch = "main";
  const cacheKey = `github:${owner}:${repo}:${branch}`;

  try {
    let data = await kv.get(cacheKey);
    if (data) {
      console.log(`Cache hit for ${repo}`);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Fetching ${repo} from GitHub (cache miss)`);
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          "User-Agent": "debian-portfolio-app",
        },
      }
    );

    if (!res.ok) {
      console.error(`GitHub API failed: ${res.status} ${res.statusText}`);
      return new Response("Failed to fetch repo", { status: 500 });
    }

    data = await res.json();

    await kv.set(cacheKey, data, { ex: CACHE_TTL });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

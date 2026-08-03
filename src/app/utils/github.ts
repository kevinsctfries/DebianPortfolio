export type GitHubFile = {
  name: string;
  type: "file" | "dir";
  path: string;
  url: string;
  sha: string;
};

type GitHubTreeItem = {
  path: string;
  type: "tree" | "blob";
  url: string;
  sha: string;
};

export async function fetchRepoTree(owner: string, repo: string) {
  const res = await fetch(`/api/github/repos/${owner}/${repo}/tree`);

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        `GitHub rate limited. Try again in 1 hour or add a Personal Access Token.`,
      );
    }
    throw new Error(`failed to fetch ${repo}: ${res.status}`);
  }
  const data = await res.json();

  return data.tree.map((item: GitHubTreeItem) => ({
    name: item.path.split("/").pop(),
    path: item.path,
    type: item.type === "tree" ? "dir" : "file",
    url: item.url,
    sha: item.sha,
  }));
}

import type { FileNode } from "@/app/apps/FileExplorer/FileExplorer";

export function buildFileNodeFromRepo(
  owner: string,
  repoName: string,
  files: GitHubFile[],
): FileNode {
  const root: FileNode = {
    type: "directory",
    description: repoName,
    contents: {},
  };

  files.forEach((file) => {
    const parts = file.path.split("/");
    let node = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!node.contents) node.contents = {};

      if (i === parts.length - 1) {
        node.contents[part] =
          file.type === "dir"
            ? { type: "directory", description: part, contents: {} }
            : {
                type: "file",
                description: part,
                owner,
                repo: repoName,
                sha: file.sha,
              };
      } else {
        if (!node.contents[part]) {
          node.contents[part] = {
            type: "directory",
            description: part,
            contents: {},
          };
        }
        node = node.contents[part];
      }
    }
  });

  return root;
}

export async function populateProjects(
  selectedRepos: { owner: string; repo: string }[],
  linuxFS: Record<string, FileNode>,
) {
  const projectsNode =
    linuxFS["/"].contents?.home.contents?.Kevin.contents?.Desktop.contents
      ?.Projects;

  if (!projectsNode) return;

  for (const r of selectedRepos) {
    try {
      const tree = await fetchRepoTree(r.owner, r.repo);
      const repoNode = buildFileNodeFromRepo(r.owner, r.repo, tree);
      projectsNode.contents![r.repo] = repoNode;
    } catch (err) {
      console.error("Failed to load repo", r.repo, err);

      projectsNode.contents![r.repo] = {
        type: "directory",
        description: `${r.repo} (offline - rated limited)`,
        contents: {},
      };
    }
  }
}

export async function fetchBlobContent(
  owner: string,
  repo: string,
  sha: string,
): Promise<string> {
  const res = await fetch(`/api/github/repos/${owner}/${repo}/blob/${sha}`);

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub rate limited. Try again later.");
    }
    if (res.status === 404) {
      throw new Error("File not found.");
    }
    if (res.status === 413) {
      throw new Error("File too large to display.");
    }
    throw new Error(`Failed to fetch file content: ${res.status}`);
  }

  const data = await res.json();
  return data.content as string;
}

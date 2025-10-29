export type GitHubFile = {
  name: string;
  type: "file" | "dir";
  path: string;
  url: string;
};

type GitHubTreeItem = {
  path: string;
  type: "tree" | "blob";
  url: string;
};

export async function fetchRepoTree(owner: string, repo: string) {
  const res = await fetch(`/api/github/repos/${owner}/${repo}/tree`);
  if (!res.ok) throw new Error(`Failed to fetch ${repo}`);
  const data = await res.json();
  return data.tree.map((item: GitHubTreeItem) => ({
    name: item.path.split("/").pop(),
    path: item.path,
    type: item.type === "tree" ? "dir" : "file",
    url: item.url,
  }));
}

import type { FileNode } from "@/app/apps/FileExplorer/FileExplorer";

export function buildFileNodeFromRepo(
  repoName: string,
  files: GitHubFile[]
): FileNode {
  const root: FileNode = {
    type: "directory",
    description: repoName,
    contents: {},
  };

  files.forEach(file => {
    const parts = file.path.split("/");
    let node = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!node.contents) node.contents = {};

      if (i === parts.length - 1) {
        node.contents[part] = {
          type: file.type === "dir" ? "directory" : "file",
          description: file.name,
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
  linuxFS: Record<string, FileNode>
) {
  const projectsNode =
    linuxFS["/"].contents?.home.contents?.Kevin.contents?.Desktop.contents
      ?.Projects;

  if (!projectsNode) return;

  for (const r of selectedRepos) {
    try {
      const tree = await fetchRepoTree(r.owner, r.repo);
      const repoNode = buildFileNodeFromRepo(r.repo, tree);
      projectsNode.contents![r.repo] = repoNode;
    } catch (err) {
      console.error("Failed to load repo", r.repo, err);
    }
  }
}

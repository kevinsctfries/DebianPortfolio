"use client";

import styles from "./fileExplorer.module.scss";
import Image, { StaticImageData } from "next/image";
import linuxFSJson from "@/app/data/linux-fs.json";

// folder icons
import folderDocuments from "../../assets/places/folder-documents.svg";
import folderDownloads from "../../assets/places/folder-download.svg";
import folderMusic from "../../assets/places/folder-music.svg";
import folderPictures from "../../assets/places/folder-pictures.svg";
import folderVideos from "../../assets/places/folder-videos.svg";
import folderIcon from "../../assets/places/folder.svg";

// file icons
import reactIcon from "../../assets/files/react.svg";
import reactTsIcon from "../../assets/files/react_ts.svg";
import jsonIcon from "../../assets/files/json.svg";
import tsIcon from "../../assets/files/typescript.svg";
import cssIcon from "../../assets/files/css.svg";
import scssIcon from "../../assets/files/sass.svg";
import fileIcon from "../../assets/files/file.svg";

// action icons
import goBack from "../../assets/actions/go-previous-symbolic.svg";
import goForward from "../../assets/actions/go-next-symbolic.svg";
import goUp from "../../assets/actions/go-up-symbolic.svg";
import goHome from "../../assets/actions/go-home-symbolic.svg";
import searchIcon from "../../assets/system/edit-find-symbolic.svg";
import panLeft from "../../assets/actions/pan-start-symbolic.svg";
import panRight from "../../assets/actions/pan-end-symbolic.svg";
import editIcon from "../../assets/actions/document-edit-symbolic.svg";

// flat icons
import fsFlat from "../../assets/places/drive-harddisk-flat.svg";
import computerFlat from "../../assets/places/video-display-flat.svg";
import folderFlat from "../../assets/places/folder-flat.svg";
import trashFlat from "../../assets/places/user-trash-flat.svg";

import computerIcon from "../../assets/places/16/video-display.svg";
import homeIcon from "../../assets/places/16/user-home.svg";
import desktopIcon from "../../assets/places/16/user-desktop.svg";
import trashIcon from "../../assets/places/16/user-trash.svg";
import documentsIcon from "../../assets/places/16/folder-documents.svg";
import musicIcon from "../../assets/places/16/folder-music.svg";
import picturesIcon from "../../assets/places/16/folder-pictures.svg";
import videosIcon from "../../assets/places/16/folder-videos.svg";
import downloadsIcon from "../../assets/places/16/folder-download.svg";
import fsIcon from "../../assets/places/16/drive-harddisk.svg";
import fsDirIcon from "../../assets/system/drive-harddisk.svg";
import { useState } from "react";

export type FileNode = {
  type: "file" | "directory";
  description: string;
  contents?: Record<string, FileNode>;
  link?: string;
};

type FileTree = {
  [key: string]: FileNode;
};

type FileExplorerProps = {
  startNode?: FileNode;
  startPath?: string[];
};

const fileIcons: Record<string, StaticImageData> = {
  tsx: reactTsIcon,
  jsx: reactIcon,
  json: jsonIcon,
  png: picturesIcon,
  ts: tsIcon,
  css: cssIcon,
  scss: scssIcon,
};

const linuxFS = linuxFSJson as Record<string, FileNode>;

export default function FileExplorer({
  startNode,
  startPath,
}: FileExplorerProps) {
  const [path, setPath] = useState<string[]>(startPath ?? ["/"]);
  const [history, setHistory] = useState<string[][]>([["/"]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getNodeAtPath = (
    pathArr: string[],
    tree: FileTree
  ): FileNode | null => {
    if (!pathArr || pathArr.length === 0) return null;

    let node: FileNode | undefined;

    const root = pathArr[0];
    if (root.endsWith(":///")) {
      node = tree[root];
      if (!node) return null;
      for (let i = 1; i < pathArr.length; i++) {
        if (!node.contents) return null;
        node = node.contents[pathArr[i]];
        if (!node) return null;
      }
    } else {
      node = tree["/"];
      if (!node) return null;
      for (let i = 1; i < pathArr.length; i++) {
        if (!node.contents) return null;
        node = node.contents[pathArr[i]];
        if (!node) return null;
      }
    }

    return node ?? null;
  };

  const navigateTo = (newPath: string[]) => {
    const node = getNodeAtPath(newPath, linuxFS);
    if (!node || node.type !== "directory") {
      return;
    }

    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPath);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setPath(newPath);
  };

  const currentNode = startNode ?? getNodeAtPath(path, linuxFS);
  const items = currentNode?.contents
    ? Object.entries(currentNode.contents)
    : [];

  const enterDir = (dir: string) => {
    const node = currentNode?.contents?.[dir];
    if (!node) return;

    if (node.link) {
      navigateTo(
        node.link.split("/").filter(Boolean).length
          ? node.link.split("/")
          : ["/"]
      );
    } else {
      navigateTo([...path, dir]);
    }
  };

  const goUpDir = () => {
    if (path.length > 1) {
      navigateTo(path.slice(0, -1));
    }
  };

  const goHomeDir = () => {
    navigateTo(["/", "home", "Kevin"]);
  };

  const goBackDir = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPath(history[newIndex]);
    }
  };

  const goForwardDir = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPath(history[newIndex]);
    }
  };

  const isActivePath = (targetPath: string[]) => {
    return JSON.stringify(path) === JSON.stringify(targetPath);
  };

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [editPath, setEditPath] = useState(path.join("/"));

  const startEditingPath = () => {
    setEditPath(pathToString(path));
    setIsEditingPath(true);
  };

  const submitEditPath = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = editPath.replace(/\/$/, "");
    const newPath = cleaned.split("/").filter(Boolean);
    navigateTo(["/", ...newPath]);
    setIsEditingPath(false);
  };

  const folderCount = items.filter(
    ([_, node]) => node.type === "directory"
  ).length;
  const fileCount = items.filter(([_, node]) => node.type === "file").length;

  const getSegmentIcon = (
    segment: string,
    index: number,
    pathArr: string[]
  ) => {
    if (index === 0 && segment === "/") {
      return fsFlat;
    }

    if (segment === "Kevin" && pathArr[index - 1] === "home") {
      return goHome;
    }

    if (segment === "Desktop") {
      return folderFlat;
    }

    if (segment === "computer:///") {
      return computerFlat;
    }

    if (segment === "trash:///") {
      return trashFlat;
    }

    return null;
  };

  const isUnderUserDir =
    path.length >= 3 && path[1] === "home" && path[2] === "Kevin";

  const [showFullPath, setShowFullPath] = useState(false);

  const displaySegments = (() => {
    if (path[0].endsWith(":///")) return path;
    if (showFullPath) return path.slice(1);
    if (isUnderUserDir) return path.slice(2);
    return path.slice(1);
  })();

  const pathToString = (pathArr: string[]): string => {
    if (pathArr.length === 1) return pathArr[0];
    if (pathArr[0].endsWith(":///")) {
      return pathArr.join("/") + "/";
    }
    return "/" + pathArr.slice(1).join("/") + "/";
  };

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const renderDir = () =>
    items.map(([name, node]) => {
      const isSelected = selectedItem === name;

      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedItem(name);
      };

      let icon: StaticImageData;
      if (node.type === "directory") {
        icon = node.link === "/" ? fsDirIcon : folderIcon;
      } else {
        const ext = name.split(".").pop()?.toLowerCase();
        icon = ext && fileIcons[ext] ? fileIcons[ext] : fileIcon;
      }

      if (node.type === "directory") {
        let icon = folderIcon;

        if (node.link === "/") {
          icon = fsDirIcon;
        }

        return (
          <div
            key={name}
            className={`${styles.dir} ${isSelected ? styles.selected : ""}`}
            onClick={handleClick}
            onDoubleClick={() => enterDir(name)}>
            <Image src={icon} alt={name} width={64} height={64} />
            <div className={styles.dirHeader}>{name}</div>
          </div>
        );
      }

      return (
        <div
          key={name}
          className={`${styles.file} ${isSelected ? styles.selected : ""}`}
          onClick={handleClick}>
          <Image src={icon} alt={name} width={64} height={64} />
          <div className={styles.dirHeader}>{name}</div>
        </div>
      );
    });

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <ul className={styles.menu}>
          <li>File</li>
          <li>Edit</li>
          <li>View</li>
          <li>Go</li>
          <li>Bookmarks</li>
          <li>Help</li>
        </ul>
        <div className={styles.actions}>
          <button
            aria-label="Go Back"
            onClick={goBackDir}
            disabled={historyIndex === 0}>
            <Image
              src={goBack}
              alt="Back"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button
            aria-label="Go Forward"
            onClick={goForwardDir}
            disabled={historyIndex === history.length - 1}>
            <Image
              src={goForward}
              alt="Forward"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button aria-label="Up Directory" onClick={goUpDir}>
            <Image
              src={goUp}
              alt="Up"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button aria-label="Home" onClick={goHomeDir}>
            <Image
              src={goHome}
              alt="Home"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <div className={styles.dirPath}>
            {isEditingPath ? (
              <form onSubmit={submitEditPath}>
                <input
                  type="text"
                  value={editPath}
                  onChange={e => setEditPath(e.target.value)}
                  onBlur={() => setIsEditingPath(false)}
                  autoFocus
                  className={styles.pathInput}
                  aria-label="Directory Path"
                />
              </form>
            ) : (
              <>
                <Image
                  src={panLeft}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.panLeft}
                  onClick={() => setShowFullPath(true)}
                />
                {path[0] === "/" && (
                  <div
                    className={`${styles.pathSegment} ${
                      path.length === 1 ? styles.active : ""
                    }`}
                    onClick={() => navigateTo(["/"])}>
                    <Image
                      src={fsFlat}
                      alt="File System"
                      width={16}
                      height={16}
                      className={styles.pathIcon}
                    />
                  </div>
                )}

                {displaySegments.map((dir, idx) => {
                  let realIdx: number;

                  if (showFullPath) {
                    realIdx = idx + 1;
                  } else if (isUnderUserDir) {
                    realIdx = idx + 2;
                  } else {
                    realIdx = idx + 1;
                  }

                  const subPath = path.slice(0, realIdx + 1);

                  const isActive = idx === displaySegments.length - 1;
                  const icon = getSegmentIcon(dir, realIdx, path);

                  return (
                    <div
                      key={idx}
                      className={`${styles.pathSegment} ${
                        isActive ? styles.active : ""
                      }`}
                      onClick={() => navigateTo(subPath)}>
                      {icon && (
                        <Image
                          src={icon}
                          alt=""
                          width={16}
                          height={16}
                          className={styles.pathIcon}
                        />
                      )}
                      {dir}
                    </div>
                  );
                })}
                <div className={styles.pathSpacer} onClick={startEditingPath}>
                  <Image src={editIcon} alt="" width={16} height={16} />
                </div>
                <Image
                  src={panRight}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.panRight}
                />
              </>
            )}
          </div>

          <button aria-label="Search">
            <Image
              src={searchIcon}
              alt="Search"
              width={24}
              height={24}
              className={styles.searchBtn}
            />
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.section}>
            <span>Places</span>
            <ul>
              <li
                className={isActivePath(["computer:///"]) ? styles.active : ""}
                onClick={() => navigateTo(["computer:///"])}>
                <Image
                  src={computerIcon}
                  alt="Computer"
                  width={16}
                  height={16}
                />
                Computer
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin"]) ? styles.active : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin"])}>
                <Image src={homeIcon} alt="Home" width={16} height={16} />
                kevin
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Desktop"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Desktop"])}>
                <Image src={desktopIcon} alt="Desktop" width={16} height={16} />
                Desktop
              </li>

              <li
                className={isActivePath(["trash:///"]) ? styles.active : ""}
                onClick={() => navigateTo(["trash:///"])}>
                <Image src={trashIcon} alt="Trash" width={16} height={16} />
                Trash
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Documents"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Documents"])}>
                <Image
                  src={documentsIcon}
                  alt="Documents"
                  width={16}
                  height={16}
                />
                Documents
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Music"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Music"])}>
                <Image src={musicIcon} alt="Music" width={16} height={16} />
                Music
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Pictures"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Pictures"])}>
                <Image
                  src={picturesIcon}
                  alt="Pictures"
                  width={16}
                  height={16}
                />
                Pictures
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Videos"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Videos"])}>
                <Image src={videosIcon} alt="Videos" width={16} height={16} />
                Videos
              </li>

              <li
                className={
                  isActivePath(["/", "home", "Kevin", "Downloads"])
                    ? styles.active
                    : ""
                }
                onClick={() => navigateTo(["/", "home", "Kevin", "Downloads"])}>
                <Image
                  src={downloadsIcon}
                  alt="Downloads"
                  width={16}
                  height={16}
                />
                Downloads
              </li>
            </ul>

            <span>Devices</span>

            <ul>
              <li
                className={isActivePath(["/"]) ? styles.active : ""}
                onClick={() => navigateTo(["/"])}>
                <Image src={fsIcon} alt="File System" width={16} height={16} />
                File System
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.main} onClick={() => setSelectedItem(null)}>
          <div className={styles.content}>{renderDir()}</div>
          <div className={styles.contentInfo}>
            <span>
              {folderCount} folder{folderCount !== 1 ? "s" : ""} | {fileCount}{" "}
              file{fileCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import styles from "./fileExplorer.module.scss";
import Image from "next/image";
import linuxFS from "@/app/data/linus-fs.json";

// folder icons
import folderDocuments from "../../assets/places/folder-documents.svg";
import folderDownloads from "../../assets/places/folder-download.svg";
import folderMusic from "../../assets/places/folder-music.svg";
import folderPictures from "../../assets/places/folder-pictures.svg";
import folderVideos from "../../assets/places/folder-videos.svg";
import folderIcon from "../../assets/places/folder.svg";

// action icons
import goBack from "../../assets/actions/go-previous-symbolic.svg";
import goForward from "../../assets/actions/go-next-symbolic.svg";
import goUp from "../../assets/actions/go-up-symbolic.svg";
import goHome from "../../assets/actions/go-home-symbolic.svg";
import searchIcon from "../../assets/system/edit-find-symbolic.svg";

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
import { useState } from "react";

type FileNode = {
  type: "file" | "directory";
  description: string;
  contents?: Record<string, FileNode>;
};

export default function FileExplorer() {
  const [path, setPath] = useState<string[]>(["/"]);
  const [history, setHistory] = useState<string[][]>([["/"]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getNodeAtPath = (pathArr: string[], tree: any): FileNode => {
    let node: FileNode = tree["/"];
    for (let i = 1; i < pathArr.length; i++) {
      node = node.contents?.[pathArr[i]] as FileNode;
    }
    return node;
  };

  const navigateTo = (newPath: string[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPath);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setPath(newPath);
  };

  const currentNode = getNodeAtPath(path, linuxFS);
  const items = currentNode.contents
    ? Object.entries(currentNode.contents)
    : [];

  const enterDir = (dir: string) => {
    navigateTo([...path, dir]);
  };

  const goUpDir = () => {
    if (path.length > 1) {
      navigateTo(path.slice(0, -1));
    }
  };

  const goHomeDir = () => {
    navigateTo(["/", "home", "user"]);
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

  const renderDir = () =>
    items.map(([name, node]) => {
      if (node.type === "directory") {
        return (
          <div
            key={name}
            className={styles.dir}
            onDoubleClick={() => enterDir(name)}>
            <Image src={folderIcon} alt={name} width={64} height={64} />
            <div className={styles.dirHeader}>{name}</div>
          </div>
        );
      }
      return (
        <div key={name} className={styles.file}>
          <span>File</span> {name}
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
          <button onClick={goBackDir} disabled={historyIndex === 0}>
            <Image
              src={goBack}
              alt="Back"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button
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
          <button onClick={goUpDir}>
            <Image
              src={goUp}
              alt="Up"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button onClick={goHomeDir}>
            <Image
              src={goHome}
              alt="Home"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <div className={styles.dirPath}></div>
          <button>
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
              <li>
                <Image
                  src={computerIcon}
                  alt="Computer"
                  width={16}
                  height={16}
                />
                Computer
              </li>
              <li>
                <Image src={homeIcon} alt="Home" width={16} height={16} />
                kevin
              </li>
              <li>
                <Image src={desktopIcon} alt="Desktop" width={16} height={16} />
                Desktop
              </li>
              <li>
                <Image src={trashIcon} alt="Trash" width={16} height={16} />
                Trash
              </li>
              <li>
                <Image
                  src={documentsIcon}
                  alt="Documents"
                  width={16}
                  height={16}
                />
                Documents
              </li>
              <li>
                <Image src={musicIcon} alt="Music" width={16} height={16} />
                Music
              </li>
              <li>
                <Image
                  src={picturesIcon}
                  alt="Pictures"
                  width={16}
                  height={16}
                />
                Pictures
              </li>
              <li>
                <Image src={videosIcon} alt="Videos" width={16} height={16} />
                Videos
              </li>
              <li>
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
              <li>
                <Image src={fsIcon} alt="File System" width={16} height={16} />
                File System
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.content}>{renderDir()}</div>
        </div>
      </div>
    </div>
  );
}

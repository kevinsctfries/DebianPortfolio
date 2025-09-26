"use client";

import styles from "./fileExplorer.module.scss";
import Image from "next/image";

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

type FileItem = {
  name: string;
  type: "file" | "dir";
  icon?: string;
  children?: FileItem[];
};

const mockFiles: FileItem[] = [
  { name: ".cache", type: "dir", icon: folderIcon },
  { name: ".config", type: "dir", icon: folderIcon },
  { name: ".ssh", type: "dir", icon: folderIcon },
  { name: "Desktop", type: "dir", icon: folderIcon },
  { name: "Documents", type: "dir", icon: folderDocuments },
  { name: "Downloads", type: "dir", icon: folderDownloads },
  { name: "Music", type: "dir", icon: folderMusic },
  { name: "Pictures", type: "dir", icon: folderPictures },
  { name: "Public", type: "dir", icon: folderIcon },
  { name: ".local", type: "dir", icon: folderIcon },
  { name: "Trash", type: "dir", icon: folderIcon },
  { name: "Videos", type: "dir", icon: folderVideos },
  { name: "Text", type: "file" }, // No icon for files yet (placeholder)
];

export default function FileExplorer() {
  const renderTree = (items: FileItem[], parent = "") =>
    items.map(item => {
      const path = `${parent}/${item.name}`;

      if (item.type === "dir") {
        return (
          <div key={path} className={styles.dir}>
            <Image
              src={item.icon || folderIcon}
              alt={item.name}
              width={64}
              height={64}
            />
            <div className={styles.dirHeader}>{item.name}</div>
          </div>
        );
      }

      return (
        <div key={path} className={styles.file}>
          <span>File</span> {item.name}
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
          <button>
            <Image
              src={goBack}
              alt="Back"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button>
            <Image
              src={goForward}
              alt="Forward"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button>
            <Image
              src={goUp}
              alt="Up"
              width={24}
              height={24}
              className={styles.actionBtn}
            />
          </button>
          <button>
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
          <div className={styles.content}>{renderTree(mockFiles)}</div>
        </div>
      </div>
    </div>
  );
}

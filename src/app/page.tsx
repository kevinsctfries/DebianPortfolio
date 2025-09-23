import Desktop from "./components/Desktop/Desktop";
import { DesktopProvider } from "./components/Desktop/DesktopContext";
import Panel from "./components/Panel/Panel";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <DesktopProvider>
      <div className={styles.layout}>
        <Panel />
        <Desktop />
      </div>
    </DesktopProvider>
  );
}

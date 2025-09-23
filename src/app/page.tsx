import Desktop from "./components/Desktop";
import { DesktopProvider } from "./components/DesktopContext";
import Panel from "./components/Panel";
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

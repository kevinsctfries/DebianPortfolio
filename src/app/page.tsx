import Desktop from "./components/Desktop";
import { DesktopProvider } from "./components/DesktopContext";

export default function Home() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}

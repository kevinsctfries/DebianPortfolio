import React from "react";
import styles from "./settings.module.scss";

const Settings = () => {
  return (
    <div className={styles.settings}>
      <input aria-label="search" type="text" className={styles.search} />
      <div className={styles.stuff}>
        <span>Personal</span>
        <div className={styles.settingsApps}>
          <span>Appearance</span>
          <span>Desktop</span>
          <span>Notifications</span>
          <span>Panel</span>
          <span>Window Manager</span>
          <span>Window Manager Tweaks</span>
          <span>Workspaces</span>
          <span>Xfce Screensaver</span>
          <span>Xfce Terminal Settings</span>
        </div>
        <span>Hardware</span>
        <div className={styles.settingsApps}>
          <span>Additional Drivers</span>
          <span>Advanced Network Configuration</span>
          <span>Color Profiles</span>
          <span>Display</span>
          <span>Keyboard</span>
          <span>Mouse and Touchpad</span>
          <span>Power Manager</span>
          <span>PulseAudio Volume Control</span>
          <span>Removable Drives and Media</span>
        </div>
        <span>System</span>
        <div className={styles.settingsApps}>
          <span>Accessibility</span>
          <span>Default Applications</span>
          <span>Session and Startup</span>
          <span>Software & Updates</span>
        </div>
        <span>Other</span>
        <div className={styles.settingsApps}>
          <span>Settings Editor</span>
        </div>
      </div>
      <div>
        <button>Help</button>
        <button>All Settings</button>
        <button>Close</button>
      </div>
    </div>
  );
};

export default Settings;

"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Image from "next/image";
import styles from "./loginmanager.module.scss";
import profileIcon from "../../assets/system/preferences-desktop-personal.svg";

type LoginManagerProps = {
  username?: string;
  onLogin: () => void;
};

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M4 8h8M8.5 4.5 12 8l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginManager({
  username = "Kevin",
  onLogin,
}: LoginManagerProps) {
  const [password, setPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    passwordRef.current?.focus();

    const updateTime = () => {
      const now = new Date();
      setTime(
        toZonedTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (authenticating) return;

    setAuthenticating(true);

    setTimeout(() => {
      setAuthenticating(false);
      onLogin();
    }, 650);
  }

  return (
    <div className={styles.greeter}>
      <div className={styles.topBar}>
        <div className={styles.clock}>
          {mounted && time ? format(time, "h:mm a") : ""}
        </div>
        <div className={styles.date}>
          {mounted && time ? format(time, "EEEE, MMMM d") : ""}
        </div>
      </div>

      <div className={styles.centerStage}>
        <div className={styles.loginBox}>
          <div className={styles.avatar}>
            <Image src={profileIcon} alt="" width={40} height={40} />
          </div>
          <div className={styles.username}>{username}</div>

          <form onSubmit={handleSubmit} className={styles.passwordForm}>
            <div className={styles.passwordRow}>
              <LockIcon />
              <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                disabled={authenticating}
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Log In"
                disabled={authenticating}
                className={styles.submitButton}
              >
                <ArrowIcon />
              </button>
            </div>
          </form>

          <div className={styles.status}>
            {authenticating ? "Authenticating…" : "Hint: any password works"}
          </div>
        </div>
      </div>
    </div>
  );
}

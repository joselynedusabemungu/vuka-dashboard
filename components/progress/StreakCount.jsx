import React from "react";
import styles from "./StreakCount.module.css";

export default function StreakCount({ currentStreak = 0 }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className={styles.cardFrame}>
      <div className={styles.infoBlock}>
        <h3 className={styles.cardTitle}>Streak Count</h3>
        <div className={styles.streakLine}>
          <span className={styles.emojiIcon}>🔥</span>
          <span className={styles.countValue}>{currentStreak}</span>
        </div>
      </div>

      <div className={styles.timelineRow} aria-label="Weekdays">
        {days.map((day, idx) => (
          <span key={`${day}-${idx}`} className={styles.dayLabel}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

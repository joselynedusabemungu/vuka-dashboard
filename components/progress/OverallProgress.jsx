import React from "react";
import styles from "./OveralProgress.module.css";

export default function OverallProgress({ percentage = 0 }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className={styles.cardFrame}>
      <h3 className={styles.cardTitle}>Overall Progress</h3>
      <div className={styles.chartBox}>
        <svg className={styles.svgRing} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#009450"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className={styles.centerValue}>{percentage}%</span>
      </div>
    </div>
  );
}

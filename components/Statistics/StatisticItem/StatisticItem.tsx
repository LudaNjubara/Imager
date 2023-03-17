import React from "react";
import { TStatisticsData } from "../../../types/globals";
import styles from "./statisticItem.module.css";

type TStatisticItemProps = {
  statistics?: TStatisticsData;
};

function StatisticItem({ statistics }: TStatisticItemProps) {
  return (
    <article className={styles.statisticItem__wrapper}>
      <h2 className={styles.statisticItem__title}>{statistics?.imageUploads?.title}</h2>
      <div className={styles.statisticItem__graphContainer}>
        <span className={styles.statisticItem__value}>{statistics?.imageUploads?.value}</span>
      </div>
    </article>
  );
}

export default StatisticItem;

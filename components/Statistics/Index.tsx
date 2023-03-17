"use client";

import { useAppStatistics } from "../../hooks/hooks";
import { TStatisticsData } from "../../types/globals";
import StatisticItem from "./StatisticItem/StatisticItem";

import styles from "./statistics.module.css";

function StatisticsContainer() {
  const { appStatisticsData } = useAppStatistics();

  return (
    <div className={styles.statisticsContainer__wrapper}>
      <h1 className={styles.statisticsContainer__title}>Statistics</h1>
      <section className={styles.statisticsContainer__graphsContainer}>
        {appStatisticsData &&
          Object.keys(appStatisticsData).map((key) => (
            <StatisticItem
              key={appStatisticsData[key as keyof TStatisticsData]?.title}
              statistics={appStatisticsData}
            />
          ))}
      </section>
    </div>
  );
}

export default StatisticsContainer;

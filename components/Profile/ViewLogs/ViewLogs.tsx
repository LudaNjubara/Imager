"use client";

import { useState, useEffect } from "react";

import { useUserLogs } from "../../../hooks/hooks";
import { TLogData } from "../../../types/globals";

import ViewLogsContainer from "./ViewLogsContainer/ViewLogsContainer";
import ViewLogsFilter from "./ViewLogsFilter/ViewLogsFilter";

import styles from "./viewLogs.module.css";

function ViewLogs() {
  const { userLogsData, isLoading, isError } = useUserLogs();
  const [filteredLogs, setFilteredLogs] = useState<TLogData[]>([]);

  useEffect(() => {
    setFilteredLogs(userLogsData);
  }, [userLogsData]);

  return (
    <div className={styles.editUsersContainer__wrapper}>
      <section className={styles.editUsersContainer__container}>
        <ViewLogsFilter logs={userLogsData} setFilteredLogs={setFilteredLogs} />
        <ViewLogsContainer logs={filteredLogs} />
      </section>
    </div>
  );
}

export default ViewLogs;

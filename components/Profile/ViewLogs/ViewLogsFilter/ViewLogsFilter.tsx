"use client";

import { useState } from "react";

import { TLogData } from "../../../../types/globals";

import styles from "./viewLogsFilter.module.css";

type TViewLogsFilterProps = {
  logs: TLogData[];
  setFilteredLogs: (logs: TLogData[]) => void;
};

const ViewLogsFilter = ({ logs, setFilteredLogs }: TViewLogsFilterProps) => {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState<{
    from?: number;
    to?: number;
  }>({});
  const [browser, setBrowser] = useState("");
  const [os, setOs] = useState("");

  const handleFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let filteredLogs = logs;

    if (username) {
      filteredLogs = filteredLogs.filter((log) => log.username === username);
    }

    if (date && date.from && date.to) {
      filteredLogs = filteredLogs.filter((log) => log.time >= date.from! && log.time <= date.to!);
    } else if (date && date.from) {
      filteredLogs = filteredLogs.filter((log) => log.time >= date.from!);
    } else if (date && date.to) {
      filteredLogs = filteredLogs.filter((log) => log.time <= date.to!);
    }

    if (browser) {
      filteredLogs = filteredLogs.filter((log) => log.userAgent.browser === browser);
    }

    if (os) {
      filteredLogs = filteredLogs.filter((log) => log.userAgent.os === os);
    }

    setFilteredLogs(filteredLogs);
  };

  return (
    <>
      <h2 className={styles.viewLogsFilter__title}>Filter logs</h2>
      <form className={styles.viewLogsFilter__form} onSubmit={handleFilterChange}>
        <input
          className={styles.viewLogsFilter__input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.viewLogsFilter__input}
          type="text"
          placeholder="Browser"
          value={browser}
          onChange={(e) => setBrowser(e.target.value)}
        />
        <input
          className={styles.viewLogsFilter__input}
          type="text"
          placeholder="Operating System"
          value={os}
          onChange={(e) => setOs(e.target.value)}
        />
        <input
          className={styles.viewLogsFilter__input}
          type="datetime-local"
          placeholder="Start Time"
          value={date.from}
          onChange={(e) =>
            setDate({
              ...date,
              from: e.target.valueAsNumber,
            })
          }
        />
        <input
          className={styles.viewLogsFilter__input}
          type="datetime-local"
          placeholder="End Time"
          value={date.to}
          onChange={(e) =>
            setDate({
              ...date,
              to: e.target.valueAsNumber,
            })
          }
        />
        <button className={styles.viewLogsFilter__button} type="submit">
          Filter
        </button>
      </form>
    </>
  );
};

export default ViewLogsFilter;

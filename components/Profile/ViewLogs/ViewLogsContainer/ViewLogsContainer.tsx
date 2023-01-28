import { TLogData } from "../../../../types/globals";

import ViewLogsContainerItem from "./ViewLogsContainerItem";

import styles from "./viewLogsContainer.module.css";

type TViewLogsContainerProps = {
  logs: TLogData[];
};

const ViewLogsContainer = ({ logs }: TViewLogsContainerProps) => {
  return (
    <>
      <section className={styles.viewLogsContainer__container}>
        <h2 className={styles.viewLogsContainer__title}>Logs</h2>

        <header className={styles.viewLogsContainer__header}>
          <span className={styles.viewLogsContainer__item}>Username</span>

          <span className={`${styles.viewLogsContainer__item} ${styles.action}`}>Action</span>

          <div className={styles.viewLogsContainer__header__rightContainer}>
            <span className={styles.viewLogsContainer__item}>OS</span>

            <span className={styles.viewLogsContainer__item}>Date</span>
          </div>
        </header>

        {logs?.map((log) => (
          <ViewLogsContainerItem key={log.id} log={log} />
        ))}
      </section>
    </>
  );
};

export default ViewLogsContainer;

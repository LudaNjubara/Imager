import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { toDateOptions } from "../../../../constants/constants";
import { TLogData } from "../../../../types/globals";

import styles from "./viewLogsContainerItem.module.css";
import { GeoPoint } from "firebase/firestore";

type TViewLogsContainerItemProps = {
  log: TLogData;
};

function ViewLogsContainerItem({ log }: TViewLogsContainerItemProps) {
  const [isItemOpened, setIsItemOpened] = useState(false);

  const toggleItemClick = () => {
    setIsItemOpened(!isItemOpened);
  };

  return (
    <article className={styles.viewLogsContainerItem__container}>
      <div className={styles.viewLogsContainerItem__quickView} onClick={toggleItemClick}>
        <span className={styles.viewLogsContainerItem__item}>{log.username}</span>

        <span className={`${styles.viewLogsContainerItem__item} ${styles.action}`}>{log.action.title}</span>

        <div className={styles.viewLogsContainerItem__rightContainer}>
          <span className={styles.viewLogsContainerItem__item}>{log.userAgent.os}</span>

          <span className={styles.viewLogsContainerItem__item}>
            {new Date(log.time).toLocaleDateString("en-US", toDateOptions)}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isItemOpened && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.viewLogsContainerItem__fullView}
          >
            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Username</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>{log.username}</span>
            </div>

            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Title</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>{log.action.title}</span>
            </div>

            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Description</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>
                {log.action.description}
              </span>
            </div>

            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Time</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>
                {new Date(log.time).toLocaleDateString("en-US", toDateOptions)}
              </span>
            </div>

            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Browser</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>
                {log.userAgent.browser}
              </span>
            </div>

            <div className={styles.viewLogsContainerItem__fullView__item}>
              <span className={styles.viewLogsContainerItem__fullView__item__title}>Operating system</span>
              <span className={styles.viewLogsContainerItem__fullView__item__value}>{log.userAgent.os}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default ViewLogsContainerItem;

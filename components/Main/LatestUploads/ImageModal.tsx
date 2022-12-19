import { Timestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import { TImageInfo } from "../../../types/globals";
import { imageUpload__modalVariants, toDateOptions } from "../../../constants/constants";

import { BsDownload, BsXLg } from "react-icons/bs";
import styles from "./imageModal.module.css";

type ImageModalProps = {
  toggleModal: () => void;
  modalImageURL?: string;
  modalImageData?: TImageInfo;
};

function ImageModal({ toggleModal, modalImageURL, modalImageData }: ImageModalProps) {
  return (
    <AnimatePresence>
      {modalImageURL && modalImageData && (
        <div className={styles.imageModal__wrapper}>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={imageUpload__modalVariants}
            className={styles.imageModal__container}
          >
            <div className={styles.imageModal__imageWrapper}>
              <button
                type="button"
                className={styles.imageModal__container__closeButton}
                onClick={toggleModal}
              >
                <BsXLg className={styles.imageModal__container__closeButton__icon} />
              </button>
              <span className={styles.imageModal__imageContainer}>
                <img
                  src={modalImageURL}
                  alt={modalImageData.description}
                  className={styles.imageModal__image}
                />
              </span>
            </div>

            <div className={styles.imageModal__infoContainer}>
              <div className={styles.imageModal__infoContainer__main}>
                <div className={styles.imageModal__infoContainer__main__info}>
                  <div className={styles.imageModal__infoContainer__main__info__main}>
                    <img
                      src={modalImageData.uploaderPhotoURL}
                      alt="User Profile"
                      className={styles.imageModal__infoContainer__main__info__main__userImage}
                    />

                    <h4 className={styles.imageModal__infoContainer__main__info__main__title}>
                      {modalImageData.uploaderDisplayName}
                    </h4>

                    <span className={styles.imageModal__infoContainer__main__info__main__date}>
                      {Timestamp.fromMillis(modalImageData.uploadDate)
                        .toDate()
                        .toLocaleDateString("en-US", toDateOptions)}
                    </span>
                  </div>

                  <p className={styles.imageModal__infoContainer__main__info__description}>
                    {modalImageData.description}
                  </p>

                  <div className={styles.imageModal__infoContainer__main__info__hashtagsContainer}>
                    {modalImageData.hashtags.map((hashtag) => (
                      <span
                        key={hashtag}
                        className={styles.imageModal__infoContainer__main__info__hashtagsContainer__hashtag}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.imageModal__infoContainer__main__propertiesContainer}>
                  <h2 className={styles.imageModal__infoContainer__main__properties__title}>Details</h2>

                  <div className={styles.imageModal__infoContainer__main__propertiesContainer__properties}>
                    <span
                      className={
                        styles.imageModal__infoContainer__main__propertiesContainer__properties__property
                      }
                    >
                      {modalImageData.width} x {modalImageData.height}
                    </span>
                    <span
                      className={
                        styles.imageModal__infoContainer__main__propertiesContainer__properties__property
                      }
                    >
                      {(modalImageData.size / 1000000).toFixed(1)} MB
                    </span>
                    <span
                      className={
                        styles.imageModal__infoContainer__main__propertiesContainer__properties__property
                      }
                    >
                      {modalImageData.fileType}
                    </span>
                  </div>
                </div>
              </div>

              <aside className={styles.imageModal__infoContainer__aside}>
                <div className={styles.imageModal__infoContainer__aside__userActions}>
                  <button className={styles.imageModal__infoContainer__aside__userActions__button}>
                    <BsDownload
                      className={styles.imageModal__infoContainer__aside__userActions__button__icon}
                    />
                  </button>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ImageModal;

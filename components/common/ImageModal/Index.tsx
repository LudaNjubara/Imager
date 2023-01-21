import { useState, useRef } from "react";

import { Timestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import { TImageInfo } from "../../../types/globals";
import { imageUpload__modalVariants, toDateOptions } from "../../../constants/constants";

import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline, MdEditOff } from "react-icons/md";
import { BsDownload, BsXLg } from "react-icons/bs";
import styles from "./imageModal.module.css";
import facade from "../../../services/facade.class";
import { downloadImage } from "../../../utils/common/utils";
import { useAppSelector } from "../../../hooks/hooks";

type ImageModalProps = {
  toggleModal: () => void;
  modalImageURL?: string;
  modalImageData?: TImageInfo;
  canEdit?: boolean;
};

function ImageModal({ toggleModal, modalImageURL, modalImageData, canEdit }: ImageModalProps) {
  const reduxUser = useAppSelector((state) => state.user);
  const [isEditButtonClicked, setIsEditButtonClicked] = useState(false);
  const [hasImageHashtagsError, setHasImageHashtagsError] = useState<boolean>(false);
  const imageDescRef = useRef<HTMLInputElement>(null);
  const imageHashtagsRef = useRef<HTMLTextAreaElement>(null);

  const checkDescAndHashtagsValidity = () => {
    if (
      imageDescRef.current?.value.length &&
      imageHashtagsRef.current?.value.split(" ").length !== 0 &&
      !hasImageHashtagsError
    ) {
      return true;
    }

    return false;
  };

  const handleEditButtonClick = () => {
    setIsEditButtonClicked((prevState) => !prevState);
  };

  const handleConfirmEditButtonClick = () => {
    if (
      !modalImageData?.key ||
      !imageDescRef.current ||
      !imageHashtagsRef.current ||
      !checkDescAndHashtagsValidity()
    ) {
      return;
    }

    facade.UpdateImageInfo(
      imageDescRef.current.value,
      imageHashtagsRef.current?.value.split(" "),
      modalImageData.key,
      reduxUser.displayName!
    );
  };

  const handleImageHashtagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    /* if current value contains characters other than -_ and space, lowercase and uppercase letters then return */
    if (e.currentTarget.value.length === 0 || e.currentTarget.value.match(/[^a-zA-Z-_ ]/g)) {
      setHasImageHashtagsError(true);
      return;
    }

    setHasImageHashtagsError(false);
  };

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
                      src={modalImageData.uploaderPhotoURL ?? "/images/imagerLogo2.png"}
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

                  {isEditButtonClicked ? (
                    <input
                      id={styles.imageUploadModal__imageDescInput}
                      type="text"
                      name="image_desc"
                      placeholder="Description..."
                      ref={imageDescRef}
                      defaultValue={modalImageData.description}
                    />
                  ) : (
                    <p className={styles.imageModal__infoContainer__main__info__description}>
                      {modalImageData.description}
                    </p>
                  )}

                  {isEditButtonClicked ? (
                    <div id={styles.imageUploadModal__imageHashtags}>
                      <textarea
                        id={styles.imageUploadModal__imageHashtagsTextarea}
                        name="image_hashtags"
                        placeholder="Hashtags..."
                        ref={imageHashtagsRef}
                        defaultValue={modalImageData.hashtags.join(" ")}
                        onChange={handleImageHashtagsChange}
                      ></textarea>
                      <p
                        className={`${styles.imageUploadModal__notice} ${
                          hasImageHashtagsError && styles.active
                        }`}
                      >
                        * Hashtags must be separated with spaces and can only contain letters, dashes and
                        underscores.
                      </p>
                    </div>
                  ) : (
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
                  )}
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
                  <button
                    className={styles.imageModal__infoContainer__aside__userActions__button}
                    onClick={(e) => {
                      e.stopPropagation();

                      downloadImage(modalImageURL, modalImageData.key);
                    }}
                  >
                    <BsDownload
                      className={styles.imageModal__infoContainer__aside__userActions__button__icon}
                    />
                  </button>

                  {canEdit && (
                    <div className={styles.imageModal__infoContainer__aside__userActions__editContainer}>
                      <button
                        type="button"
                        className={styles.imageModal__infoContainer__aside__userActions__button}
                        onClick={handleEditButtonClick}
                      >
                        {isEditButtonClicked ? (
                          <MdEditOff
                            className={`${styles.imageModal__infoContainer__aside__userActions__button__icon} ${styles.cancel}`}
                          />
                        ) : (
                          <MdOutlineModeEditOutline
                            className={styles.imageModal__infoContainer__aside__userActions__button__icon}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {isEditButtonClicked && (
                          <motion.button
                            initial={{ y: -10, opacity: 0, scale: 0 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -10, opacity: 0, scale: 0 }}
                            type="button"
                            className={`${styles.imageModal__infoContainer__aside__userActions__button} ${styles.confirm}`}
                            onClick={handleConfirmEditButtonClick}
                          >
                            <IoCheckmarkDoneOutline
                              className={`${styles.imageModal__infoContainer__aside__userActions__button__icon} ${styles.confirm}`}
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
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

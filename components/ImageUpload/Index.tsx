import { useState } from "react";

import { useAppSelector } from "../../hooks/hooks";
import { TUser } from "../../types/globals";

import ImageUploadModal from "./ImageUploadModal";

import { AiOutlinePlus } from "react-icons/ai";
import styles from "./imageUpload.module.css";

function ImageUpload() {
  const reduxUser: TUser = useAppSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return !reduxUser.isAnonymous ? (
    <>
      <button
        type="button"
        id={styles.imageUpload__modalOpenButton}
        className={`${isModalOpen && styles.active}`}
        onClick={toggleModal}
      >
        <AiOutlinePlus className={styles.imageUpload__modalOpenButtonIcon} />
      </button>

      {isModalOpen && (
        <div id={styles.imageUpload__backgroundDarkener}>
          <ImageUploadModal />
        </div>
      )}
    </>
  ) : null;
}

export default ImageUpload;

import { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";

import ImageUploadModal from "./ImageUploadModal";

import { AiOutlinePlus } from "react-icons/ai";
import styles from "./imageUpload.module.css";

function ImageUpload() {
  const reduxUser = useAppSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
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
  );
}

export default ImageUpload;

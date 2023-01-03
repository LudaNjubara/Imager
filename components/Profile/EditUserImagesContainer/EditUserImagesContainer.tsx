"use client";

import { useAWSImageURLs, useAllUserImages } from "../../../hooks/hooks";

import ImagesContainer from "../../common/ImagesContainer/Index";

import styles from "../EditImageContainer/editImageContainer.module.css";

function EditUserImagesContainer() {
  const { allUsersImagesData, isError } = useAllUserImages();
  const { imageURLsData } = useAWSImageURLs(allUsersImagesData);

  return (
    <div className={styles.editImageContainer__wrapper}>
      <section className={styles.editImageContainer__container}>
        <ImagesContainer
          imageURLsData={imageURLsData}
          imagesData={allUsersImagesData}
          title="User images"
          canEdit
        />
      </section>
    </div>
  );
}

export default EditUserImagesContainer;

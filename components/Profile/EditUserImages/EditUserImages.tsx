"use client";

import { useAWSImageURLs, useAllUserImages } from "../../../hooks/hooks";

import ImagesContainer from "../../common/ImagesContainer/Index";

import styles from "../EditImage/editImage.module.css";

function EditUserImages() {
  const { allUsersImagesData } = useAllUserImages();
  const { imageURLsData } = useAWSImageURLs(allUsersImagesData ? allUsersImagesData : []);

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

export default EditUserImages;

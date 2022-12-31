"use client";

import { useAppSelector, useAWSImageURLs, useCurrentUserImages } from "../../../hooks/hooks";
import { TUser } from "../../../types/globals";

import ImagesContainer from "../../common/ImagesContainer/Index";

import styles from "./editImageContainer.module.css";

function EditImageContainer() {
  const reduxUser: TUser = useAppSelector((state) => state.user);
  const { currentUserImagesData, isError } = useCurrentUserImages(reduxUser.uid);
  const { imageURLsData } = useAWSImageURLs(currentUserImagesData);

  return (
    <div className={styles.editImageContainer__wrapper}>
      <section className={styles.editImageContainer__container}>
        <ImagesContainer
          imageURLsData={imageURLsData}
          imagesData={currentUserImagesData}
          title="Your images"
          canEdit
        />
      </section>
    </div>
  );
}

export default EditImageContainer;

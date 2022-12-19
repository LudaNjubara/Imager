import { useEffect, useState } from "react";

import { useAWSImageURLs, useLatestUploadsImages } from "../../../hooks/hooks";
import { TImageInfo } from "../../../types/globals";
import { extractImageDataFromURL } from "../../../utils/common/utils";

import ImageModal from "./ImageModal";
import LatestUploadItem from "./LatestUploadItem";

import styles from "./latestUploads.module.css";

function LatestUploads() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { latestUploadsImagesData, isLoading, isError } = useLatestUploadsImages();
  const { imageURLsData, isURLsLoading } = useAWSImageURLs(latestUploadsImagesData);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [modalImageURL, setModalImageURL] = useState<string>();
  const [modalImageData, setModalImageData] = useState<TImageInfo>();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalImageURLChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget as HTMLDivElement;

    const attr = target.getAttribute("data-item-image-url");
    if (!attr) throw new Error(`No data-item-image-URL attribute found in ${target}`);

    setModalImageURL(attr);
  };

  const handleLatestUploadItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    toggleModal();
    handleModalImageURLChange(e);
  };

  useEffect(() => {
    if (modalImageURL) {
      const imageData = extractImageDataFromURL(modalImageURL, latestUploadsImagesData);

      setModalImageData(imageData);
    }
  }, [modalImageURL]);

  return (
    <section className={styles.latestUploads__wrapper}>
      <h2 className={styles.latestUploads__title}>Latest Uploads</h2>
      <div className={styles.latestUploads__container}>
        {imageURLsData ? (
          imageURLsData.map((url) => (
            <LatestUploadItem
              key={url}
              imageURL={url}
              imageData={extractImageDataFromURL(url, latestUploadsImagesData)}
              handleLatestUploadItemClick={handleLatestUploadItemClick}
            />
          ))
        ) : (
          <p className={styles.latestUploads__noUploadsMessage}>
            There are currently no latest uploads... check back later!
          </p>
        )}
      </div>

      {isModalOpen && (
        <ImageModal toggleModal={toggleModal} modalImageURL={modalImageURL} modalImageData={modalImageData} />
      )}
    </section>
  );
}

export default LatestUploads;

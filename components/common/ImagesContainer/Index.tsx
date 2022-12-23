import { useState, useEffect } from "react";

import { TImageInfo } from "../../../types/globals";
import { extractImageDataFromURL } from "../../../utils/common/utils";

import ImageItem from "../ImageItem/Index";
import ImageModal from "../ImageModal/Index";

import styles from "./imagesContainer.module.css";

type TSearchResultsProps = {
  title: string;
  imagesData: TImageInfo[];
  imageURLsData: string[];
};

function ImagesContainer({ title, imagesData, imageURLsData }: TSearchResultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleImageItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    toggleModal();
    handleModalImageURLChange(e);
  };

  useEffect(() => {
    if (modalImageURL) {
      const imageData = extractImageDataFromURL(modalImageURL, imagesData);

      setModalImageData(imageData);
    }
  }, [modalImageURL]);

  return (
    <section className={styles.imagesContainer__wrapper}>
      <h2 className={styles.imagesContainer__title}>{title}</h2>
      <div className={styles.imagesContainer__container}>
        {imageURLsData ? (
          imageURLsData.map((url) => (
            <ImageItem
              key={url}
              imageURL={url}
              imageData={extractImageDataFromURL(url, imagesData)}
              handleImageItemClick={handleImageItemClick}
            />
          ))
        ) : (
          <p className={styles.imagesContainer__noUploadsMessage}>
            No images can be found... check back later!
          </p>
        )}
      </div>

      {isModalOpen && (
        <ImageModal toggleModal={toggleModal} modalImageURL={modalImageURL} modalImageData={modalImageData} />
      )}
    </section>
  );
}

export default ImagesContainer;

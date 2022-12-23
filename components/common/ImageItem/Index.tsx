import { Timestamp } from "firebase/firestore";

import { toDateOptions } from "../../../constants/constants";
import { TImageInfo } from "../../../types/globals";

import { BsDownload } from "react-icons/bs";
import styles from "./imageItem.module.css";

type TImageItemProps = {
  imageURL: string;
  imageData: TImageInfo;
  handleImageItemClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

function ImageItem({ imageURL, imageData, handleImageItemClick }: TImageItemProps) {
  return (
    <article className={styles.imageItem__item} data-item-image-url={imageURL} onClick={handleImageItemClick}>
      <img src={imageURL} alt="Latest Upload" className={styles.imageItem__image} />
      <div className={styles.imageItem__info}>
        <div className={styles.imageItem__info__top}>
          {imageData.hashtags.map((hashtag) => (
            <span key={hashtag} className={styles.imageItem__info__hashtag}>
              {hashtag}
            </span>
          ))}
        </div>

        <div className={styles.imageItem__info__bottom}>
          <div className={styles.imageItem__info__bottom__info}>
            <h5 className={styles.imageItem__info__title}>{imageData.uploaderDisplayName}</h5>
            <p className={styles.imageItem__info__date}>
              {Timestamp.fromMillis(imageData.uploadDate).toDate().toLocaleDateString("en-US", toDateOptions)}
            </p>
          </div>
          <div className={styles.imageItem__info__bottom__download}>
            <button
              type="button"
              className={styles.imageItem__downloadButton}
              onClick={(e) => {
                e.stopPropagation();

                const link = document.createElement("a");
                link.href = imageURL;
                link.setAttribute("download", `${imageData.key}.${imageData.fileType.toLowerCase()}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode!.removeChild(link);
              }}
            >
              <BsDownload className={styles.imageItem__downloadButton__icon} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ImageItem;

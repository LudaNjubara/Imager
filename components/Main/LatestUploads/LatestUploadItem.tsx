import { Timestamp } from "firebase/firestore";
import { BsDownload } from "react-icons/bs";
import { toDateOptions } from "../../../constants/constants";
import { TImageInfo } from "../../../types/globals";
import styles from "./latestUploads.module.css";

type LatestUploadItemProps = {
  imageURL: string;
  imageData: TImageInfo;
  handleLatestUploadItemClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

function LatestUploadItem({ imageURL, imageData, handleLatestUploadItemClick }: LatestUploadItemProps) {
  return (
    <article
      className={styles.latestUploads__item}
      data-item-image-url={imageURL}
      onClick={handleLatestUploadItemClick}
    >
      <img src={imageURL} alt="Latest Upload" className={styles.latestUploads__image} />
      <div className={styles.latestUploads__info}>
        <div className={styles.latestUploads__info__top}>
          {imageData.hashtags.map((hashtag) => (
            <span key={hashtag} className={styles.latestUploads__info__hashtag}>
              {hashtag}
            </span>
          ))}
        </div>

        <div className={styles.latestUploads__info__bottom}>
          <div className={styles.latestUploads__info__bottom__info}>
            <h5 className={styles.latestUploads__info__title}>{imageData.uploaderDisplayName}</h5>
            <p className={styles.latestUploads__info__date}>
              {Timestamp.fromMillis(imageData.uploadDate).toDate().toLocaleDateString("en-US", toDateOptions)}
            </p>
          </div>
          <div className={styles.latestUploads__info__bottom__download}>
            <button
              type="button"
              className={styles.latestUploads__downloadButton}
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
              <BsDownload className={styles.latestUploads__downloadButton__icon} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default LatestUploadItem;

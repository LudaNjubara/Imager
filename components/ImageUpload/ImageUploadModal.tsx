import { FormEvent, MouseEvent, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { imageUpload__modalVariants } from "../../constants/constants";

import ImageEditor from "../common/ImageEditor/Index";

import { MdOutlineImageSearch } from "react-icons/md";
import styles from "./imageUpload.module.css";
import { blobToBase64, convertBase64ToImage } from "../../utils/common/utils";
import { uploadImageToAWS } from "../../utils/imageUpload/imageUploadUtils";
import facade from "../../services/facade.class";
import { TImageInfo } from "../../types/globals";
import { useAppSelector } from "../../hooks/hooks";
import { Timestamp } from "firebase/firestore";

function ImageUploadModal() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState<string>("");
  const [imageHashtags, setImageHashtags] = useState<string[]>([]);
  const [hasImageHashtagsError, setHasImageHashtagsError] = useState<boolean>(false);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);
  const editedImageContainerRef = useRef<HTMLDivElement>();
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [imageDataURL, setImageDataURL] = useState<string | null>(null);

  const reduxUser = useAppSelector((state) => state.user);

  const checkFormValidity = () => {
    if (image && imageDesc && imageHashtags.length > 0 && !hasImageHashtagsError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const createImageObjectURL = (image: File) => {
    const imageObjectURL = encodeURI(URL.createObjectURL(image));
    return imageObjectURL;
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    imagePreviewURL && URL.revokeObjectURL(imagePreviewURL);
    setImagePreviewURL(null);
    setImage(null);

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const image = e.currentTarget.files[0];
      setImage(image);
      setImagePreviewURL(createImageObjectURL(image));
      blobToBase64(image).then((base64) => {
        setImageDataURL(base64);
      });
    }
  };

  const handleImageDescChange = (e: FormEvent<HTMLInputElement>) => {
    setImageDesc(e.currentTarget.value.trim());
  };

  const handleImageHashtagsChange = (e: FormEvent<HTMLTextAreaElement>) => {
    /* if current value contains characters other than -_ and space, lowercase and uppercase letters then return */
    if (e.currentTarget.value.length === 0 || e.currentTarget.value.match(/[^a-zA-Z-_ ]/g)) {
      setHasImageHashtagsError(true);
      return;
    }

    setHasImageHashtagsError(false);
    setImageHashtags(e.currentTarget.value.trim().toLowerCase().split(" "));
  };

  const handleImageUpload = (e: MouseEvent<HTMLButtonElement>) => {
    if (imageDataURL && image) {
      convertBase64ToImage(imageDataURL)
        .then(async (convertedImage) => {
          const height = convertedImage.height;
          const width = convertedImage.width;
          const imageExtension = imageDataURL.split(";")[0].split("/")[1];

          const res = await uploadImageToAWS(imageDataURL, imageExtension);

          if (res.imageKey) {
            const imageInfo: TImageInfo = {
              key: res.imageKey,
              fileType: imageExtension,
              size: image.size,
              height: height,
              width: width,
              hashtags: imageHashtags,
              description: imageDesc,
              uploaderUID: reduxUser.uid,
              uploaderDisplayName: reduxUser.displayName,
              uploaderPhotoURL: reduxUser.photoURL ?? null,
              uploadDate: Timestamp.now().toMillis(),
            };

            facade.AddImageInfo(imageInfo, reduxUser.uid);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    checkFormValidity();

    return () => {
      imagePreviewURL && URL.revokeObjectURL(imagePreviewURL);
    };
  }, [image, imageDesc, imageHashtags, hasImageHashtagsError]);

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={imageUpload__modalVariants}
        id={styles.imageUpload__modal}
      >
        <form id={styles.imageUploadModal__imageForm} onSubmit={(e) => e.preventDefault()}>
          <label
            htmlFor={styles.imageUploadModal__imageInput}
            tabIndex={0}
            id={styles.imageUploadModal__imageInputLabel}
            role="button"
          >
            <MdOutlineImageSearch className={styles.imageUploadModal__imageInputLabelIcon} />
            <span className={styles.imageUploadModal__imageInputLabelText}>Choose image</span>
            <input
              id={styles.imageUploadModal__imageInput}
              className={styles.imageUploadModal__imageFormButton}
              onChange={handleImageChange}
              type="file"
              name="image"
              accept="image/*"
            />
          </label>

          <input
            id={styles.imageUploadModal__imageDescInput}
            onChange={handleImageDescChange}
            type="text"
            name="image_desc"
            placeholder="Description..."
          />

          <div id={styles.imageUploadModal__imageHashtags}>
            <textarea
              id={styles.imageUploadModal__imageHashtagsTextarea}
              name="image_hashtags"
              placeholder="Hashtags..."
              onChange={handleImageHashtagsChange}
            ></textarea>
            <p className={`${styles.imageUploadModal__notice} ${hasImageHashtagsError && styles.active}`}>
              * Hashtags must be separated with spaces and can only contain letters, dashes and underscores.
            </p>
          </div>

          <button
            type="button"
            className={styles.imageUploadModal__imageUploadButton}
            onClick={handleImageUpload}
            disabled={!isFormValid}
          >
            Upload
          </button>
        </form>

        <div id={styles.imageUploadModal__imagePreviewContainer}>
          <ImageEditor
            imageURL={imagePreviewURL}
            containerRef={editedImageContainerRef}
            setImageDataURL={setImageDataURL}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageUploadModal;

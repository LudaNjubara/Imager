import { FormEvent, MouseEvent, useState, useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import { TImageInfo } from "../../types/globals";
import { useAppSelector } from "../../hooks/hooks";
import { imageUpload__modalVariants } from "../../constants/constants";
import { uploadImageInfoToDatabase, uploadImageToAWS } from "../../utils/imageUpload/imageUploadUtils";

import styles from "./imageUpload.module.css";
import { MdOutlineImageSearch } from "react-icons/md";

function ImageUploadModal() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState<string>("");
  const [imageHashtags, setImageHashtags] = useState<string[]>([]);
  const [hasImageHashtagsError, setHasImageHashtagsError] = useState<boolean>(false);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const reduxUser = useAppSelector((state) => state.user);

  const checkFormValidity = () => {
    if (image && imageDesc && imageHashtags.length > 0 && !hasImageHashtagsError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleImageUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (image) {
      const res = await uploadImageToAWS(image);

      if (res.imageKey) {
        const imageInfo: TImageInfo = {
          key: res.imageKey,
          fileType: image.type,
          size: image.size,
          hashtags: imageHashtags,
          description: imageDesc,
          uploaderUID: reduxUser.uid,
          uploaderDisplayName: reduxUser.displayName,
          uploadDate: serverTimestamp(),
        };

        uploadImageInfoToDatabase(imageInfo);
      }
    }
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    imagePreviewURL && URL.revokeObjectURL(imagePreviewURL);
    setImagePreviewURL(null);
    setImage(null);

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const image = e.currentTarget.files[0];
      setImage(image);
      setImagePreviewURL(createImageObjectURL(image));
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
    setImageHashtags(e.currentTarget.value.trim().split(" "));
  };

  const createImageObjectURL = (image: File) => {
    const imageObjectURL = URL.createObjectURL(image);
    return imageObjectURL;
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
            id={styles.imageUploadModal__imageUploadButton}
            onClick={handleImageUpload}
            disabled={!isFormValid}
          >
            Upload
          </button>
        </form>

        <div id={styles.imageUploadModal__imagePreviewContainer}>
          {imagePreviewURL && <img src={imagePreviewURL} alt="image preview" />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageUploadModal;

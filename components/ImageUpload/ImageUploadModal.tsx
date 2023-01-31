import { FormEvent, MouseEvent, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timestamp } from "firebase/firestore";

import { imageUpload__modalVariants } from "../../constants/constants";
import { fileToBase64, base64ToImage } from "../../utils/common/utils";
import { uploadImageToAWS } from "../../utils/imageUpload/imageUploadUtils";
import facade from "../../services/facade.class";
import { TAllowedImageExtensions, TImageInfo } from "../../types/globals";
import { useAppSelector } from "../../hooks/hooks";

import ImageEditor from "../common/ImageEditor/Index";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdOutlineImageSearch } from "react-icons/md";
import styles from "./imageUpload.module.css";

function ImageUploadModal() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState<string>("");
  const [imageHashtags, setImageHashtags] = useState<string[]>([]);
  const [hasImageHashtagsError, setHasImageHashtagsError] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [imageDataURL, setImageDataURL] = useState<string | null>(null);
  const [uploadingState, setUploadingState] = useState<"uploading" | "success" | "error">();

  const reduxUser = useAppSelector((state) => state.user);

  const checkFormValidity = () => {
    const imageHashtagsPresent = imageHashtags.length > 0;
    const imageHashtagsValid = !hasImageHashtagsError;
    const imagePresent = !!image;
    const imageDescPresent = !!imageDesc;

    if (imagePresent && imageDescPresent && imageHashtagsPresent && imageHashtagsValid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    // Set the image to null to remove the image.
    setImage(null);
    setImageDataURL(null);

    // If there is an image file uploaded, create an object URL for the image and set the image state variable.
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const image = e.currentTarget.files[0];
      setImage(image);
      // Convert the image file to a base64 string and set the imageDataURL state variable.
      fileToBase64(image)
        .then((base64) => {
          setImageDataURL(base64);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleImageDescChange = (e: FormEvent<HTMLInputElement>) => {
    setImageDesc(e.currentTarget.value.trim());
  };

  const handleImageHashtagsChange = (e: FormEvent<HTMLTextAreaElement>) => {
    // Get the value of the text area
    const imageHashtags = e.currentTarget.value.trim().toLowerCase().split(" ");
    // Check if the input contains characters other than -_ and space, lowercase and uppercase letters
    if (e.currentTarget.value.length === 0 || e.currentTarget.value.match(/[^a-zA-Z-_ ]/g)) {
      setHasImageHashtagsError(true);
      return;
    }

    setHasImageHashtagsError(false);
    setImageHashtags(imageHashtags);
  };

  const handleImageUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!imageDataURL || !image) {
      return;
    }

    try {
      // Set the uploading state to uploading.
      setUploadingState("uploading");
      let timeout: NodeJS.Timeout;

      // Convert the base64 data URL to an image.
      const convertedImage = await base64ToImage(imageDataURL);
      const height = convertedImage.height;
      const width = convertedImage.width;
      const imageExtension = imageDataURL
        .split(";")[0]
        .split("/")[1]
        .toUpperCase() as TAllowedImageExtensions;

      try {
        // Upload the image to AWS.
        const { imageKey } = await uploadImageToAWS(imageDataURL, imageExtension);

        // Add the image info to the database.
        const imageInfo: TImageInfo = {
          key: imageKey,
          extension: imageExtension,
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

        // Set the uploading state to success.
        setUploadingState("success");
      } catch (error) {
        console.error(error);
        setUploadingState("error");
      } finally {
        // Set the uploading state to undefined after 3 seconds.
        setTimeout(() => {
          setUploadingState(undefined);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setUploadingState("error");
    }
  };

  useEffect(() => {
    checkFormValidity();
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
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml, image/tiff, image/bmp, image/avif"
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

          <span className={styles.imageUploadModal__infoText}>
            <AiOutlineInfoCircle className={styles.imageUploadModal__infoIcon} />
            Remember to save the image before uploading if you edited it in the preview on the right.
          </span>

          <button
            type="button"
            className={`${styles.imageUploadModal__imageUploadButton} 
            ${uploadingState === "uploading" && styles.uploading}
            ${uploadingState === "success" && styles.success}
            ${uploadingState === "error" && styles.error}
              `}
            onClick={handleImageUpload}
            disabled={!isFormValid}
          >
            {uploadingState === "uploading"
              ? "Uploading..."
              : uploadingState === "success"
              ? "Success!"
              : uploadingState === "error"
              ? "Error"
              : "Upload"}
          </button>
        </form>

        <div id={styles.imageUploadModal__imagePreviewContainer}>
          <ImageEditor imageURL={imageDataURL} setImageDataURL={setImageDataURL} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageUploadModal;

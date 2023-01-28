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

  const createImageObjectURL = (image: File) => {
    // Create an object URL from the image file
    const objectURL = encodeURI(URL.createObjectURL(image));
    return objectURL;
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    // If there is an imagePreviewURL, revoke the object URL to prevent memory leaks.
    imagePreviewURL && URL.revokeObjectURL(imagePreviewURL);
    // Set the imagePreviewURL to null to remove the preview.
    setImagePreviewURL(null);
    // Set the image to null to remove the image.
    setImage(null);

    // If there is an image file uploaded, create an object URL for the image and
    // set the image and imagePreviewURL state variables.
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const image = e.currentTarget.files[0];
      setImage(image);
      setImagePreviewURL(createImageObjectURL(image));
      // Convert the image file to a base64 string and set the imageDataURL state variable.
      blobToBase64(image)
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
      // Convert the base64 data URL to an image.
      const convertedImage = await convertBase64ToImage(imageDataURL);
      const height = convertedImage.height;
      const width = convertedImage.width;
      const imageExtension = imageDataURL.split(";")[0].split("/")[1];

      try {
        // Upload the image to AWS.
        const { imageKey } = await uploadImageToAWS(imageDataURL, imageExtension);

        // Add the image info to the database.
        const imageInfo: TImageInfo = {
          key: imageKey,
          fileType: imageExtension.toUpperCase(),
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
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
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

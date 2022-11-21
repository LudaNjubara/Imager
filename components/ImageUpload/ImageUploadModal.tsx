import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";

import { imageUpload__modalVariants } from "../../constants/constants";
import { uploadImageToAWS } from "../../utils/imageUpload/imageUploadUtils";

import styles from "./imageUpload.module.css";

function ImageUploadModal() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState<string>("");

  const handleImageUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image || !imageDesc) {
      console.log("Please select an image and add a description");
      return;
    }

    uploadImageToAWS(image);
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setImage(e.currentTarget.files[0]);
    }
  };

  const handleImageDescChange = (e: FormEvent<HTMLInputElement>) => {
    setImageDesc(e.currentTarget.value);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={imageUpload__modalVariants}
        id={styles.imageUpload__modal}
      >
        <form onSubmit={handleImageUpload}>
          <input
            onChange={handleImageDescChange}
            type="text"
            name="image_desc"
            placeholder="Description..."
          />
          <input onChange={handleImageChange} type="file" name="image" accept="image/*" />
          <button type="submit">Upload</button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImageUploadModal;

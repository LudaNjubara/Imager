import { MouseEvent, MutableRefObject, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { getEditedImage } from "../../../utils/common/utils";

import { BsFillCaretDownFill } from "react-icons/bs";
import styles from "./saveAsDropdown.module.css";
import { TEditedImageExtensions } from "../../../types/globals";

type TSaveAsDropdownProps = {
  editableImageContainerRef: MutableRefObject<HTMLDivElement | null>;
  setImageDataURL: (imageDataURL: string) => void;
};

function SaveAsDropdown({ editableImageContainerRef, setImageDataURL }: TSaveAsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleImageSave = async (e: MouseEvent<HTMLButtonElement>, extension: TEditedImageExtensions) => {
    e.preventDefault();
    if (!editableImageContainerRef.current) return;

    setIsDisabled(true);

    getEditedImage(editableImageContainerRef.current, extension)
      .then((imageDataURL) => {
        setImageDataURL(imageDataURL);

        setIsDisabled(false);
      })
      .catch((error) => {
        console.error(error);
        setIsDisabled(false);
      });
  };

  return (
    <div className={styles.saveAsDropdown__wrapper}>
      <button className={styles.saveAsDropdown__button} onClick={toggleDropdown}>
        Save As
        <BsFillCaretDownFill className={styles.saveAsDropdown__button__icon} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.saveAsDropdown__list}
          >
            <li className={styles.saveAsDropdown__list__item}>
              <button
                type="button"
                className={styles.saveAsDropdown__list__item__button}
                onClick={(e) => handleImageSave(e, "png")}
                disabled={isDisabled}
              >
                PNG
              </button>
            </li>
            <li className={styles.saveAsDropdown__list__item}>
              <button
                type="button"
                className={styles.saveAsDropdown__list__item__button}
                onClick={(e) => handleImageSave(e, "jpg")}
                disabled={isDisabled}
              >
                JPG
              </button>
            </li>
            <li className={styles.saveAsDropdown__list__item}>
              <button
                type="button"
                className={styles.saveAsDropdown__list__item__button}
                onClick={(e) => handleImageSave(e, "svg")}
                disabled={isDisabled}
              >
                SVG
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SaveAsDropdown;

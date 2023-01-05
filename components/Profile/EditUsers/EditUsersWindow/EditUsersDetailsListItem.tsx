import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import database from "../../../../services/Database/Database.class";
import { convertDatabaseFieldToReadableFormat } from "../../../../utils/common/utils";

import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline, MdEditOff } from "react-icons/md";
import styles from "./editUsersDetailsListItem.module.css";
import { validateDetailsInput } from "../../../../utils/profile/profileUtils";
import { TUserData } from "../../../../types/globals";

type TEditUsersDetailsListItemProps = {
  title: keyof TUserData;
  uid: string;
  username: string;
  currentUserUsername: string;
  value: any;
};

function EditUsersDetailsListItem({
  title,
  uid,
  username,
  currentUserUsername,
  value,
}: TEditUsersDetailsListItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasInputError, setHasInputError] = useState(false);
  const [isEditButtonClicked, setIsEditButtonClicked] = useState(false);

  const handleEditButtonClick = () => {
    setIsEditButtonClicked((prevState) => !prevState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateDetailsInput(title, e.currentTarget.value)) {
      setHasInputError(true);
    } else {
      setHasInputError(false);
    }
  };

  const handleConfirmButtonClick = () => {
    if (hasInputError) {
      return;
    }

    database.UpdateUserField(username, currentUserUsername, uid, title, inputRef.current!.value);
    setIsEditButtonClicked(false);
  };

  return (
    <li className={styles.editUsersDetailsListItem__wrapper}>
      <div className={styles.editUsersDetailsListItem__detailsContainer}>
        <span className={styles.editUsersDetailsListItem__title}>
          {convertDatabaseFieldToReadableFormat(title)}:
        </span>
        {isEditButtonClicked ? (
          <input
            type="text"
            ref={inputRef}
            defaultValue={value}
            className={`${styles.editUsersDetailsListItem__input} ${hasInputError && styles.error}`}
            placeholder="Value..."
            onChange={handleInputChange}
          />
        ) : (
          <span className={styles.editUsersDetailsListItem__value}>{value}</span>
        )}
      </div>

      <div className={styles.editUsersDetailsListItem__buttonsContainer}>
        <button
          type="button"
          className={styles.editUsersDetailsListItem__buttonsContainer__button}
          onClick={handleEditButtonClick}
        >
          {isEditButtonClicked ? (
            <MdEditOff
              className={`${styles.editUsersDetailsListItem__buttonsContainer__button__icon} ${styles.cancel}`}
            />
          ) : (
            <MdOutlineModeEditOutline
              className={styles.editUsersDetailsListItem__buttonsContainer__button__icon}
            />
          )}
        </button>

        <AnimatePresence mode="wait">
          {isEditButtonClicked && (
            <motion.button
              initial={{ x: -10, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 0, opacity: 0, scale: 0 }}
              type="button"
              className={`${styles.editUsersDetailsListItem__buttonsContainer__button} ${styles.confirm}`}
              disabled={hasInputError}
              onClick={handleConfirmButtonClick}
            >
              <IoCheckmarkDoneOutline
                className={`${styles.editUsersDetailsListItem__buttonsContainer__button__icon} ${styles.confirm}`}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}

export default EditUsersDetailsListItem;

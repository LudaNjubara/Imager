"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import observableAccountItem from "../../../../services/Profile/ObservableAccountItem.class";

import { TUserData } from "../../../../types/globals";

import EditUsersDetails from "./EditUsersDetails";
import EditUsersSidebar from "./EditUsersSidebar";

import styles from "./editUsersWindow.module.css";

function EditUsersWindow() {
  const reduxUser = useAppSelector((state) => state.user);
  const [clickedUserData, setClickedUserData] = useState<TUserData>();

  const handleClickedAccountItem = (user: TUserData) => {
    setClickedUserData(user);
  };

  useEffect(() => {
    observableAccountItem.subscribe(handleClickedAccountItem);

    return () => {
      observableAccountItem.unsubscribe(handleClickedAccountItem);
    };
  }, []);

  return (
    <div className={styles.editUsersWindow__wrapper}>
      <EditUsersSidebar />
      {!!clickedUserData ? (
        <EditUsersDetails user={clickedUserData} currentUserUsername={reduxUser.displayName!} />
      ) : null}
    </div>
  );
}

export default EditUsersWindow;

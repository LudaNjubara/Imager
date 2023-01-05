import { useState, useEffect } from "react";

import EditUsersSearchResultsItem from "./EditUsersSearchResultsItem";

import { TUserData } from "../../../../types/globals";
import observableAccountItem from "../../../../services/Profile/ObservableSearchedUsers.class";

import styles from "./editUsersSearchResults.module.css";

function EditUsersSearchResults() {
  const [searchedUsersData, setSearchedUsersData] = useState<TUserData[]>([]);

  const handleSearchData = (data: TUserData[]) => {
    setSearchedUsersData(data);
  };

  useEffect(() => {
    observableAccountItem.subscribe(handleSearchData);

    return () => {
      observableAccountItem.unsubscribe(handleSearchData);
    };
  }, []);

  return (
    <div className={styles.editUsersSearchResults__wrapper}>
      {searchedUsersData.map((user) => (
        <EditUsersSearchResultsItem key={user.username!} user={user} />
      ))}
    </div>
  );
}

export default EditUsersSearchResults;

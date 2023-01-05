import { useEffect, useState } from "react";

import styles from "./editUsersSearch.module.css";

import { BsSearch } from "react-icons/bs";
import { searchUsers } from "../../../../utils/profile/profileUtils";
import observableAccountItem from "../../../../services/Profile/ObservableSearchedUsers.class";

function EditUsersSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { searchedUsersData, isLoading, isError } = await searchUsers(searchQuery);

    if (!isLoading && !isError) {
      observableAccountItem.notify(searchedUsersData);
    }
  };

  return (
    <form className={styles.editUsersSearch__wrapper} onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Email or username..."
        className={styles.editUsersSearch__input}
        value={searchQuery}
        onChange={handleInputChnage}
      />
      <button type="submit" className={styles.editUsersSearch__button}>
        <BsSearch className={styles.editUsersSearch__icon} />
      </button>
    </form>
  );
}

export default EditUsersSearch;

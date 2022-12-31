import { useState } from "react";

import { useSearchUsers } from "../../../../hooks/hooks";
import observableAccountItem from "../../../../services/Profile/ObservableSearchedUsers.class";

import { BsSearch } from "react-icons/bs";
import styles from "./editUsersSearch.module.css";

function EditUsersSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { searchedUsersData, isLoading, isError } = await useSearchUsers(searchQuery);

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

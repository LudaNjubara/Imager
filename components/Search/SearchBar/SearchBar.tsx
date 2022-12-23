import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TImageInfo, TSearchFilter } from "../../../types/globals";
import { searchImages } from "../../../hooks/hooks";

import { BsSearch } from "react-icons/bs";
import styles from "./searchBar.module.css";

type TSearchBarProps = {
  setSearchResults: (results: TImageInfo[]) => void;
};

function SearchBar({ setSearchResults }: TSearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const [dateSearchInput, setDateSearchInput] = useState<{
    from?: number;
    to?: number;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState<TSearchFilter>("hashtags");
  const filters: TSearchFilter[] = ["date", "size", "author", "hashtags", "extension"];

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFilter !== "date") {
      if (searchText.length < 2) return;
    } else {
      if (!dateSearchInput.from || !dateSearchInput.to) return;
    }

    const results = await searchImages(
      selectedFilter,
      searchText,
      selectedFilter === "date" ? dateSearchInput : undefined
    );

    setSearchResults(results);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value) return;

    if (event.currentTarget.id === "searchBar__dateFrom") {
      const startOfDay = new Date(event.currentTarget.valueAsNumber).setHours(0, 0, 0, 0);
      setDateSearchInput({ ...dateSearchInput, from: startOfDay });
    } else {
      const endOfDay = new Date(event.currentTarget.valueAsNumber).setHours(23, 59, 59, 999);
      setDateSearchInput({ ...dateSearchInput, to: endOfDay });
    }
  };

  return (
    <header className={styles.searchBar__header}>
      <form className={styles.searchBar__container} onSubmit={handleSearch}>
        <div className={styles.searchBar__dropdownContainer}>
          <select
            value={selectedFilter}
            className={styles.searchBar__searchDropdown}
            onChange={(e) => setSelectedFilter(e.target.value as TSearchFilter)}
          >
            {filters.map((filter) => (
              <option value={filter} key={filter}>
                {filter}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.searchBar__searchFieldContainer}>
          <AnimatePresence mode="popLayout" initial={false}>
            {selectedFilter === "date" && (
              <motion.div
                key="searchBar__dateFilterContainer"
                initial={{ y: -55 }}
                animate={{
                  y: 0,
                  transition: {
                    duration: 0.5,
                  },
                }}
                exit={{
                  y: -55,
                  transition: {
                    duration: 0.5,
                  },
                }}
                className={styles.searchBar__dateFilterContainer}
              >
                <label htmlFor="searchBar__dateFrom">
                  <input
                    type="date"
                    id="searchBar__dateFrom"
                    className={styles.searchBar__dateFilter}
                    onChange={handleDateChange}
                  />
                </label>

                <label htmlFor="searchBar__dateTo">
                  <input
                    type="date"
                    id="searchBar__dateTo"
                    className={styles.searchBar__dateFilter}
                    onChange={handleDateChange}
                  />
                </label>
              </motion.div>
            )}

            {selectedFilter !== "date" && (
              <motion.div
                key="searchBar__search"
                initial={{ y: 55 }}
                animate={{
                  y: 0,
                  transition: {
                    duration: 0.5,
                  },
                }}
                exit={{
                  y: 55,
                  transition: {
                    duration: 0.5,
                  },
                }}
              >
                <label htmlFor="searchBar__search">
                  <input
                    type="text"
                    id="searchBar__search"
                    className={styles.searchBar__searchInput}
                    value={searchText}
                    placeholder="Search with selected filter..."
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" className={styles.searchBar__searchButton}>
          Search
          <BsSearch className={styles.searchBar__searchIcon} />
        </button>
      </form>
    </header>
  );
}

export default SearchBar;

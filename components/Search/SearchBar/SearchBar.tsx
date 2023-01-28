import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TImageInfo, TSearchFilter } from "../../../types/globals";
import { searchImages } from "../../../hooks/hooks";

import { BsSearch } from "react-icons/bs";
import styles from "./searchBar.module.css";

type TSearchBarProps = {
  setSearchResults: (results: TImageInfo[]) => void;
};

const isValidQuery = (
  selectedFilter: TSearchFilter,
  searchQuery: string,
  dateSearchInput: { from?: number; to?: number }
) => {
  // Date search input is valid if both `from` and `to` are set
  const dateSearchIsValid = selectedFilter === "date" && dateSearchInput.from && dateSearchInput.to;

  // Size search input is valid if the length of the query is greater than 1 and the query is a number
  const sizeSearchIsValid =
    selectedFilter === "size" && searchQuery.length > 1 && !isNaN(Number(searchQuery));

  // All other search inputs are valid if the length of the query is greater than 2
  const otherSearchIsValid = selectedFilter !== "size" && selectedFilter !== "date" && searchQuery.length > 2;

  return dateSearchIsValid || sizeSearchIsValid || otherSearchIsValid;
};

function SearchBar({ setSearchResults }: TSearchBarProps) {
  const [searchQuery, setSearchText] = useState("");
  const [dateSearchInput, setDateSearchInput] = useState<{
    from?: number;
    to?: number;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState<TSearchFilter>("hashtags");
  const filters: TSearchFilter[] = ["date", "size", "author", "hashtags", "extension"];

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the search query and date input
    if (!isValidQuery(selectedFilter, searchQuery, dateSearchInput)) return;

    // Search for images using the search query and date input
    const results = await searchImages(selectedFilter, searchQuery, dateSearchInput);

    // Display the search results
    setSearchResults(results);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) return;

    // get the date value from the DOM element
    const date = new Date(e.currentTarget.valueAsNumber);

    // if the date is the date FROM input
    if (e.currentTarget.id === "searchBar__dateFrom") {
      // set the date to the start of the day
      const startOfDay = date.setHours(0, 0, 0, 0);
      // update the dateSearchInput state
      setDateSearchInput({ ...dateSearchInput, from: startOfDay });
    } else {
      // set the date to the end of the day
      const endOfDay = date.setHours(23, 59, 59, 999);
      // update the dateSearchInput state
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
                    value={searchQuery}
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

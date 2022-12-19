import { useState } from "react";

import styles from "./searchBar.module.css";

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("date");
  const filters = ["date", "size", "hashtags", "author"];

  return (
    <div>
      <input type="text" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
      <select value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value)}>
        {filters.map((filter) => (
          <option value={filter} key={filter}>
            {filter}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;

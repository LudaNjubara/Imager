"use client";

import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";

function Search() {
  return (
    <>
      <SearchBar />
      <main>
        <SearchResults />
      </main>
    </>
  );
}

export default Search;

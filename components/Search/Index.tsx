"use client";

import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";

function Search() {
  return (
    <>
      <header>
        <SearchBar />
      </header>
      <main>
        <SearchResults />
      </main>
    </>
  );
}

export default Search;

"use client";

import { useState } from "react";

import { useAWSImageURLs } from "../../hooks/hooks";
import { TImageInfo } from "../../types/globals";

import SearchBar from "./SearchBar/SearchBar";
import ImagesContainer from "../common/ImagesContainer/Index";

function Search() {
  const [searchResults, setSearchResults] = useState<TImageInfo[]>([]);
  const { imageURLsData } = useAWSImageURLs(searchResults);

  return (
    <>
      <SearchBar setSearchResults={setSearchResults} />
      <main style={{ marginTop: 100 }}>
        <ImagesContainer title="Search Results" imagesData={searchResults} imageURLsData={imageURLsData} />
      </main>
    </>
  );
}

export default Search;

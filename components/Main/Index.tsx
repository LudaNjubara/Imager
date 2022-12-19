"use client";

import { useAppSelector } from "../../hooks/hooks";
import LatestUploads from "./LatestUploads/LatestUploads";

function Main() {
  const reduxUser = useAppSelector((state) => state.user);
  return (
    <>
      <LatestUploads />
    </>
  );
}

export default Main;

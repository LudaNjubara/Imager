"use client";

import { useAppSelector } from "../../hooks/hooks";
import LatestUploads from "./LatestUploads/LatestUploads";

function Main() {
  const reduxUser = useAppSelector((state) => state.user);
  return <>{reduxUser.uid && <LatestUploads />}</>;
}

export default Main;

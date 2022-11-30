"use client";

import { useAppSelector } from "../../hooks/hooks";

function Main() {
  const reduxUser = useAppSelector((state) => state.user);
  return <div>{reduxUser.email}</div>;
}

export default Main;

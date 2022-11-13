import { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";

function Suggested() {
  const reduxUser = useAppSelector((state) => state.user);
  return (
    <div>
      <span>Redux state</span>
      <br />
      <span>{reduxUser.uid}</span>
    </div>
  );
}

export default Suggested;

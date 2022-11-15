import { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";

function Suggested() {
  const reduxUser = useAppSelector((state) => state.user);
  return (
    <div>
      <p>Redux state</p>
      <br />
      <p>{reduxUser.uid}</p>
    </div>
  );
}

export default Suggested;

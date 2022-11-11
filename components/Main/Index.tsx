import { useAppSelector } from "../../hooks/hooks";

import styles from "./main.module.css";

function Main() {
  const user = useAppSelector((state) => state.user);

  return (
    <div id={styles.suggestedTagsWrapper}>
      {user.isAnonymous ? <span>User is here</span> : <span>User is not here</span>}
    </div>
  );
}

export default Main;

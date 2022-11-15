import { User as FirebaseUser } from "firebase/auth";

import styles from "./main.module.css";
import Suggested from "./Suggested";

function Main({ user }: { user: FirebaseUser }) {
  return (
    <div id={styles.suggestedTagsWrapper}>{user.isAnonymous ? <Suggested /> : <p>User is not here</p>}</div>
  );
}

export default Main;

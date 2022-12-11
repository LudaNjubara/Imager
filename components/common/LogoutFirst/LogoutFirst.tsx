import { auth } from "../../../config/firebaseConfig";

import styles from "./logoutFirst.module.css";

function LogoutFirst() {
  return (
    <>
      <p className={styles.login__message}>Log out before logging in as another user.</p>
      <button type="button" className={styles.login__logoutButton} onClick={() => auth.signOut()}>
        Logout
      </button>
    </>
  );
}

export default LogoutFirst;

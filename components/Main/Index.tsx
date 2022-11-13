import { useEffect } from "react";

import { useAppDispatch } from "../../hooks/hooks";

import { User as FirebaseUser } from "firebase/auth";

import styles from "./main.module.css";
import { login } from "../../redux/userSlice";
import { useIsFirstRender } from "usehooks-ts";
import Suggested from "./Suggested";

function Main({ user }: { user: FirebaseUser }) {
  const isFirstRender = useIsFirstRender();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isFirstRender) {
      dispatch(
        login({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          },
        })
      );
    }
  }, [isFirstRender, user]);

  return (
    <div id={styles.suggestedTagsWrapper}>
      {user.isAnonymous ? <Suggested /> : <span>User is not here</span>}
    </div>
  );
}

export default Main;

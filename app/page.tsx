"use client";

import { useEffect } from "react";

import { auth } from "../config/firebaseConfig";
import { signInAnonymously } from "firebase/auth";
import { useIsFirstRender } from "usehooks-ts";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { login, selectUser } from "../redux/userSlice";

import Main from "../components/Main/Index";

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isFirstRender = useIsFirstRender();

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const userInfo = userCredential.user;
        dispatch(
          login({
            ...user,
            uid: userInfo.uid,
            isAnonymous: userInfo.isAnonymous,
            email: userInfo.email,
            displayName: userInfo.displayName,
            photoURL: userInfo.photoURL,
            emailVerified: userInfo.emailVerified,
            phoneNumber: userInfo.phoneNumber,
            providerId: userInfo.providerId,
            metadata: {
              creationTime: userInfo.metadata.creationTime,
              lastSignInTime: userInfo.metadata.lastSignInTime,
            },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isFirstRender) return;

    if (user.isAnonymous) return;

    anonymousSignIn();
  }, [isFirstRender]);

  return (
    <main id="main">
      <Main />
    </main>
  );
}

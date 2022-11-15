import { useEffect } from "react";

import {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../config/firebaseConfig";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { login } from "../../redux/userSlice";
import { authProviderFactory } from "../../services/authProviderFactory";
import Loading from "../Loading/Index";
import Router from "next/router";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then(({ user }) => {
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
        console.log("User signed in anonymously: ", user);
        router.push("/");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleSignIn = (providerId: string) => {
    const provider = authProviderFactory(providerId);
    // add scope for getting displayName
    if (providerId === "google") provider.instance.addScope("profile");
    else if (providerId === "github") provider.instance.addScope("user");

    if (user) {
      const currentUser = user;

      linkWithPopup(currentUser, provider.instance)
        .then(({ user }) => {
          // Accounts successfully linked.
          console.log(`User account linked to ${providerId} successfully`, user);
          router.push("/");
        })
        .catch((error) => {
          if (error.code === "auth/credential-already-in-use") {
            signInWithRedirect(auth, provider.instance)
              .then(({ user }) => {
                console.log(`User successfully signed in with ${providerId}`, user);
                router.push("/");
              })
              .catch((error) => {
                // Handle Errors here.
                // ...
                console.error("error", error);
              });
          }
        });
    } else {
      signInWithPopup(auth, provider.instance)
        .then(({ user }) => {
          dispatch(
            login({
              uid: user.uid,
              isAnonymous: user.isAnonymous,
              email: user.email,
              displayName: user.providerData[0].displayName,
              photoURL: user.providerData[0].photoURL,
              emailVerified: user.emailVerified,
              phoneNumber: user.phoneNumber,
              providerId: user.providerId,
              metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
              },
            })
          );
          console.log(`User successfuly signed in with ${providerId}`, user);
          router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          // User is signed in.
          dispatch(
            login({
              uid: user.uid,
              isAnonymous: user.isAnonymous,
              email: user.email,
              displayName: user.providerData[0].displayName,
              photoURL: user.providerData[0].photoURL,
              emailVerified: user.emailVerified,
              phoneNumber: user.phoneNumber,
              providerId: user.providerId,
              metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
              },
            })
          );

          router.push("/");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  });

  return loading ? (
    <Loading />
  ) : (
    <div>
      <button onClick={() => handleSignIn("google")}>Continue with Google</button>
      <button onClick={() => handleSignIn("github")}>Continue with GitHub</button>
      {!user && <button onClick={anonymousSignIn}>Continue as Guest</button>}
    </div>
  );
}

export default LoginForm;

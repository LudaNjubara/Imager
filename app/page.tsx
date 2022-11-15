"use client";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../config/firebaseConfig";

import Loading from "../components/Loading/Index";
import Login from "../components/Login/Index";
import Main from "../components/Main/Index";
import { useAppDispatch } from "../hooks/hooks";
import { login } from "../redux/userSlice";

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useAppDispatch();

  if (user && !user.isAnonymous) {
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
  }

  return loading ? <Loading /> : user ? <Main user={user} /> : <Login />;
}

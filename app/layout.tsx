"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useRouter, usePathname } from "next/navigation";
import { Provider, useDispatch } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

import Head from "./head";
import ImageUpload from "../components/ImageUpload/Index";
import Sidebar from "../components/Sidebar/Index";

import { auth } from "../config/firebaseConfig";
import store from "../redux/store";
import { login, logout } from "../redux/userSlice";

import { poppins } from "../constants/constants";

import { useAppSelector, useUserData } from "../hooks/hooks";
import facade from "../services/facade.class";

import "../styles/globals.css";

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const reduxUser = useAppSelector((state) => state.user);
  const { userData } = useUserData(reduxUser.uid);
  const [hasPreviouslyLoggedInAsAnonymous, setHasPreviouslyLoggedInAsAnonymous] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      if (pathname !== "/login" && pathname !== "/register") router.push("/login");
      dispatch(logout());
      setHasPreviouslyLoggedInAsAnonymous(false);
    } else if (!loading && user) {
      if (user.isAnonymous && !hasPreviouslyLoggedInAsAnonymous) {
        setHasPreviouslyLoggedInAsAnonymous(true);
        return;
      }

      if (!user.isAnonymous && hasPreviouslyLoggedInAsAnonymous) {
        setHasPreviouslyLoggedInAsAnonymous(false);
        return;
      }

      dispatch(
        login({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName:
            userData?.username ??
            user.displayName ??
            user.providerData[0]?.displayName ??
            user.providerData[1]?.displayName,
          photoURL: user?.photoURL ?? user.providerData[0]?.photoURL ?? undefined,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          },
        })
      );

      if (pathname === "/login" || pathname === "/register") {
        router.push("/");
      }
    }
  }, [user, loading, userData?.username, hasPreviouslyLoggedInAsAnonymous]);

  useEffect(() => {
    if (user && !!userData) {
      try {
        facade.UpdateUserAccountPlan(user.uid, userData, {
          fromProfilePage: false,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [user, userData]);

  return (
    <div id="pageWrapper">
      <Sidebar />
      {user && !user.isAnonymous && <ImageUpload />}
      {!loading && <main id="main">{children}</main>}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head />

      <body className={poppins.className}>
        <Provider store={store}>
          <RootLayoutInner>{children}</RootLayoutInner>
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}

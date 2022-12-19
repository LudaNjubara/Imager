"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Provider, useDispatch } from "react-redux";

import store from "../redux/store";

import Head from "./head";
import ImageUpload from "../components/ImageUpload/Index";
import Sidebar from "../components/Sidebar/Index";

import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebaseConfig";
import { login, logout } from "../redux/userSlice";
import { poppins } from "../constants/constants";

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      if (pathname !== "/login" && pathname !== "/register") router.push("/login");
      dispatch(logout());
    } else if (!loading && user) {
      dispatch(
        login({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName: user?.displayName ?? user.providerData[0]?.displayName,
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
      router.push("/");
    }
  }, [user, loading]);

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
          <RootLayoutInner children={children} />
        </Provider>
      </body>
    </html>
  );
}

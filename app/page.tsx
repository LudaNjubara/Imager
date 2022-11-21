"use client";

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { auth } from "../config/firebaseConfig";

import Loading from "../components/Loading/Index";
import Main from "../components/Main/Index";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  return loading ? <Loading /> : user ? <Main /> : null;
}

"use client";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../config/firebaseConfig";

import Loading from "../components/Loading/Index";
import Login from "../components/Login/Index";
import Main from "../components/Main/Index";

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  return loading ? <Loading /> : user ? <Main user={user} /> : <Login />;
}

"use client";

import { Poppins } from "@next/font/google";
import { Provider } from "react-redux";

import Head from "./head";
import Sidebar from "../components/Sidebar/Index";
import store from "../redux/store";

import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head />

      <body className={poppins.className}>
        <Provider store={store}>
          <div id="pageWrapper">
            <Sidebar />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}

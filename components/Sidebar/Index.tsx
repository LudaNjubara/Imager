"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Logo from "../Logo/Index";

import { auth } from "../../config/firebaseConfig";

import { BsHouse, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import styles from "./sidebar.module.css";
import { useAuthState } from "react-firebase-hooks/auth";

function Sidebar() {
  const [user, loading, error] = useAuthState(auth);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>(pathname?.split("/")[1] ?? "");

  const handleActiveLinkChange = (page: string) => {
    setActiveLink(page);
  };

  useEffect(() => {
    handleActiveLinkChange(pathname?.split("/")[1] ?? "");

    return () => {
      setActiveLink(pathname?.split("/")[1] ?? "");
    };
  }, [pathname]);

  return (
    <aside id={styles.sidebar}>
      <div>{loading && "Loading"}</div>

      {!loading && (
        <>
          {user && (
            <>
              <div className={styles.logoWrapper}>
                <Logo />
              </div>

              <nav className={styles.nav}>
                <ul className={styles.navList}>
                  <li className={styles.navItem}>
                    <Link
                      href="/"
                      className={`${styles.navItem__link} ${activeLink === "" && styles.active}`}
                    >
                      <BsHouse className={styles.navItem__icon} />
                      <span className={styles.navItem__text}>Home</span>
                    </Link>
                  </li>

                  <li className={styles.navItem}>
                    <Link
                      href="/about"
                      className={`${styles.navItem__link} ${activeLink === "about" && styles.active}`}
                    >
                      <BsSearch className={styles.navItem__icon} />
                      <span className={styles.navItem__text}>About</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          )}

          {(!user || user.isAnonymous) && (
            <div className={styles.loginOrRegisterWrapper}>
              <Link
                href="/login"
                className={`${styles.loginOrRegister__link} ${activeLink === "login" && styles.active}`}
              >
                <span className={styles.loginOrRegister__text}>Login</span>
              </Link>

              <Link
                href="/register"
                className={`${styles.loginOrRegister__link} ${activeLink === "register" && styles.active}`}
              >
                <span className={styles.loginOrRegister__text}>Register</span>
              </Link>
            </div>
          )}

          {user && !user.isAnonymous && (
            <div className={styles.userProfileWrapper}>
              <Link
                href="/profile"
                className={`${styles.userProfile__link} ${activeLink === "profile" && styles.active}`}
              >
                <Image
                  className={styles.userProfile__image}
                  src={user.photoURL ?? user.providerData[0].photoURL ?? "/images/imagerLogo_small.png"}
                  alt="User profile"
                  width={35}
                  height={35}
                />
                <span className={styles.userProfile__username}>
                  {user.displayName ?? user.providerData[0].displayName}
                </span>
              </Link>

              <button type="button" className={styles.logoutButton} onClick={() => auth.signOut()}>
                <BsBoxArrowLeft className={styles.logoutIcon} />
              </button>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

export default Sidebar;

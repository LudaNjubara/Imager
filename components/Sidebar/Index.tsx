"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Logo from "../Logo/Index";

import { auth } from "../../config/firebaseConfig";

import { BsHouse, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import styles from "./sidebar.module.css";

function Sidebar() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<string>(pathname?.split("/")[1] ?? "");
  const [user, setUser] = useState(true);

  const logout = () => {
    auth.signOut().then(() => {
      setUser(false);
    });
  };

  const handleActiveLinkChange = (page: string) => {
    setActiveLink(page);
  };

  return (
    <aside id={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Logo />
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link
              href="/"
              className={`${styles.navItem__link} ${activeLink === "" && styles.active}`}
              onClick={() => handleActiveLinkChange("")}
            >
              <BsHouse className={styles.navItem__icon} />
              <span className={styles.navItem__text}>Home</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link
              href="/browse"
              className={`${styles.navItem__link} ${activeLink === "browse" && styles.active}`}
              onClick={() => handleActiveLinkChange("browse")}
            >
              <BsSearch className={styles.navItem__icon} />
              <span className={styles.navItem__text}>Browse</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link
              href="/about"
              className={`${styles.navItem__link} ${activeLink === "about" && styles.active}`}
              onClick={() => handleActiveLinkChange("about")}
            >
              <BsSearch className={styles.navItem__icon} />
              <span className={styles.navItem__text}>About</span>
            </Link>
          </li>
        </ul>
      </nav>

      {user ? (
        <div className={styles.userProfileWrapper}>
          <Link
            href="/profile"
            className={`${styles.userProfile__link} ${activeLink === "profile" && styles.active}`}
            onClick={() => handleActiveLinkChange("profile")}
          >
            <Image
              className={styles.userProfile__image}
              src="/images/imagerLogo_small.png"
              alt="User profile"
              width={35}
              height={35}
            />
            <span className={styles.userProfile__username}>LudaNjubara</span>
          </Link>

          <button type="button" className={styles.logoutButton} onClick={logout}>
            <BsBoxArrowLeft className={styles.logoutIcon} />
          </button>
        </div>
      ) : (
        <div className={styles.loginOrRegisterWrapper}>
          <Link
            href="/login"
            className={`${styles.loginOrRegister__link} ${activeLink === "login" && styles.active}`}
            onClick={() => handleActiveLinkChange("login")}
          >
            <span className={styles.loginOrRegister__text}>Login</span>
          </Link>

          <Link
            href="/register"
            className={`${styles.loginOrRegister__link} ${activeLink === "register" && styles.active}`}
            onClick={() => handleActiveLinkChange("register")}
          >
            <span className={styles.loginOrRegister__text}>Register</span>
          </Link>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

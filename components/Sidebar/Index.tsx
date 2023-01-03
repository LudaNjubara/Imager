import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Logo from "../Logo/Index";

import { auth } from "../../config/firebaseConfig";

import { BsHouse, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import styles from "./sidebar.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAccountPlans, useUserData } from "../../hooks/hooks";
import { setCSSVariable } from "../../utils/common/utils";
import { TAccountPlan } from "../../types/globals";

function Sidebar() {
  const [user, loading, error] = useAuthState(auth);
  const pathname = usePathname();
  const { userData } = useUserData(user?.uid);
  const { accountPlansData, isError } = useAccountPlans();
  const [activeLink, setActiveLink] = useState<string>(pathname?.split("/")[1] ?? "");
  const [userAccountPlan, setUserAccountPlan] = useState<TAccountPlan>();

  const handleActiveLinkChange = (page: string) => {
    setActiveLink(page);
  };

  useEffect(() => {
    handleActiveLinkChange(pathname?.split("/")[1] ?? "");

    return () => {
      setActiveLink(pathname?.split("/")[1] ?? "");
    };
  }, [pathname]);

  useEffect(() => {
    if (userData && accountPlansData) {
      setUserAccountPlan(accountPlansData.find((plan) => plan.name === userData.accountPlan));
    }
  }, [userData, accountPlansData]);

  useEffect(() => {
    if (userData && userAccountPlan) {
      setCSSVariable(
        "--uploads-used-value-left",
        `${(userData.uploadsUsed! / userAccountPlan.maxUploadLimit) * 93}%`
      );
    }
  }, [userData, userAccountPlan]);

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
                      href="/search"
                      className={`${styles.navItem__link} ${activeLink === "search" && styles.active}`}
                    >
                      <BsSearch className={styles.navItem__icon} />
                      <span className={styles.navItem__text}>Search</span>
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
              <>
                {!!userData && !!userAccountPlan && (
                  <div className={styles.userProfile__statsContainer}>
                    <div className={styles.userProfile__stat}>
                      <p className={styles.stat__title}>Image consumption:</p>

                      <label htmlFor="stat__uploadsUsed" className={styles.stat__label}>
                        <meter
                          id="stat__uploadsUsed"
                          className={styles.stat__meter}
                          value={userData.uploadsUsed}
                          low={userAccountPlan.maxUploadLimit! * 0.2}
                          high={userAccountPlan.maxUploadLimit! * 0.8}
                          optimum={userAccountPlan.maxUploadLimit! * 0.5}
                          min="0"
                          max={userAccountPlan.maxUploadLimit}
                        />
                      </label>

                      <div className={styles.stat__values}>
                        <span className={styles.stat__value}>0</span>
                        <span className={`${styles.stat__value} ${styles.stat__indicator}`}>
                          {userData.uploadsUsed}
                        </span>
                        <span className={styles.stat__value}>{userAccountPlan.maxUploadLimit}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.userProfile__userActionsContainer}>
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
                      {userData?.username ?? user.displayName ?? user.providerData[0].displayName}
                    </span>
                  </Link>

                  <button type="button" className={styles.logoutButton} onClick={() => auth.signOut()}>
                    <BsBoxArrowLeft className={styles.logoutIcon} />
                  </button>
                </div>
              </>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

export default Sidebar;

"use client";

import Link from "next/link";

import { EAccountRole } from "../../types/globals";
import { useUserData, useAppSelector } from "../../hooks/hooks";

import styles from "./profileDashboard.module.css";

function ProfileDashboard() {
  const reduxUser = useAppSelector((state) => state.user);
  const { userData } = useUserData(reduxUser.uid);

  return (
    <div className={styles.profileDashboard__container}>
      <Link className={styles.profileDashboard__link} href={"/profile/edit-images"}>
        <img src="/images/edit_image_bg.webp" alt="Edit images background" />
        <span className={styles.profileDashboard__link__darkener}></span>
        <h3 className={styles.profileDashboard__link__title}>Edit images</h3>
      </Link>

      <Link className={styles.profileDashboard__link} href={"/profile/edit-account"}>
        <h3 className={styles.profileDashboard__link__title}>Edit account</h3>
        <img src="/images/edit_account_bg.webp" alt="Edit account background" />
        <span className={styles.profileDashboard__link__darkener}></span>
      </Link>

      {userData?.accountRole === EAccountRole.Admin && (
        <Link className={styles.profileDashboard__link} href={"/profile/edit-users"}>
          <img src="/images/edit_users_bg.webp" alt="Edit users background" />
          <span className={styles.profileDashboard__link__darkener}></span>
          <h3 className={styles.profileDashboard__link__title}>Edit users</h3>
        </Link>
      )}

      {userData?.accountRole === EAccountRole.Admin && (
        <Link className={styles.profileDashboard__link} href={"/profile/edit-user-images"}>
          <img src="/images/edit_image_bg.webp" alt="Edit user images background" />
          <span className={styles.profileDashboard__link__darkener}></span>
          <h3 className={styles.profileDashboard__link__title}>Edit user images</h3>
        </Link>
      )}

      {userData?.accountRole === EAccountRole.Admin && (
        <Link className={styles.profileDashboard__link} href={"/profile/view-user-logs"}>
          <img src="/images/edit_image_bg.webp" alt="View logs background" />
          <span className={styles.profileDashboard__link__darkener}></span>
          <h3 className={styles.profileDashboard__link__title}>View user logs</h3>
        </Link>
      )}
    </div>
  );
}

export default ProfileDashboard;

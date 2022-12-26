import Link from "next/link";

import styles from "./profileDashboard.module.css";

function ProfileDashboard() {
  return (
    <div className={styles.profileDashboard__container}>
      <Link className={styles.profileDashboard__link} href={"/profile/editimages"}>
        <img src="/images/edit_image_bg.jpg" alt="Edit images background" />
        <span className={styles.profileDashboard__link__darkener}></span>
        <h3 className={styles.profileDashboard__link__title}>Edit images</h3>
      </Link>
      <Link className={styles.profileDashboard__link} href={"/profile/editaccount"}>
        <h3 className={styles.profileDashboard__link__title}>Edit account</h3>
        <img src="/images/edit_user_bg.jpg" alt="Edit account background" />
        <span className={styles.profileDashboard__link__darkener}></span>
      </Link>
    </div>
  );
}

export default ProfileDashboard;

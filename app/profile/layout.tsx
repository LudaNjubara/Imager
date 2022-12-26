import styles from "../../styles/layouts.module.css";

function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.profileDashboard__wrapper}>
      <h2 className={styles.profileDashbord__title}>Profile Dashboard</h2>
      {children}
    </section>
  );
}

export default ProfileLayout;

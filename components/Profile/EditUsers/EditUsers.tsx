import styles from "./editUsers.module.css";
import EditUsersWindow from "./EditUsersWindow/Index";

function EditUsers() {
  return (
    <div className={styles.editUsersContainer__wrapper}>
      <section className={styles.editUsersContainer__container}>
        <EditUsersWindow />
      </section>
    </div>
  );
}

export default EditUsers;

import styles from "./editUsersContainer.module.css";
import EditUsersWindow from "./EditUsersWindow/Index";

function EditUsersContainer() {
  return (
    <div className={styles.editUsersContainer__wrapper}>
      <section className={styles.editUsersContainer__container}>
        <EditUsersWindow />
      </section>
    </div>
  );
}

export default EditUsersContainer;

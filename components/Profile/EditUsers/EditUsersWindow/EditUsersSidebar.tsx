import EditUsersSearch from "./EditUsersSearch";
import EditUsersSearchResults from "./EditUsersSearchResults";

import styles from "./editUsersSidebar.module.css";

function EditUsersSidebar() {
  return (
    <aside className={styles.editUsersSidebar__wrapper}>
      <EditUsersSearch />
      <EditUsersSearchResults />
    </aside>
  );
}

export default EditUsersSidebar;

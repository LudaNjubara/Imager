import observableAccountItem from "../../../../services/Profile/ObservableAccountItem.class";
import { TUserData } from "../../../../types/globals";
import styles from "./editUsersSearchResultsItem.module.css";

type TEditUsersSearchResultsItemProps = {
  user: TUserData;
};

function EditUsersSearchResultsItem({ user }: TEditUsersSearchResultsItemProps) {
  const handleItemClicked = () => {
    observableAccountItem.notify(user);
  };

  return (
    <button className={styles.editUsersSearchResultsItem__wrapper} onClick={handleItemClicked}>
      <span className={styles.editUsersSearchResultsItem__imageContainer}>
        <img
          src={user.photoURL ? user.photoURL : "/images/imagerLogo2.png"}
          alt="user profile"
          className={styles.editUsersSearchResultsItem__image}
        />
      </span>
      <span className={styles.editUsersSearchResultsItem__name}>{user.username}</span>
    </button>
  );
}

export default EditUsersSearchResultsItem;

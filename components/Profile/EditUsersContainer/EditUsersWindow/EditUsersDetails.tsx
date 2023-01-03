import { TUserData } from "../../../../types/globals";

import styles from "./editUsersDetails.module.css";
import EditUsersDetailsListItem from "./EditUsersDetailsListItem";

type TEditUsersDetailsProps = {
  user: TUserData;
  currentUserUsername: string;
};

/* Create a function that will be used in a javascript sort method that sorts keys of object of type TUserData. Keys such as uploadsUsed, accountRole and accountPlan take presedence over other keys. */

function EditUsersDetails({ user, currentUserUsername }: TEditUsersDetailsProps) {
  return (
    <section className={styles.editUsersDetails__wrapper}>
      <h2 className={styles.editUsersDetails__title}>User Details</h2>

      <div className={styles.editUsersDetails__container}>
        <div className={styles.editUsersDetails__container__profile}>
          <span className={styles.editUsersDetails__container__profile__imageContainer}>
            <img
              src={user.photoURL ? user.photoURL : "/images/imagerLogo2.png"}
              alt="user profile"
              className={styles.editUsersDetails__container__profile__imageContainer__image}
            />
          </span>
          <h4 className={styles.editUsersDetails__container__profile__name}>{user.username}</h4>
        </div>

        <div className={styles.editUsersDetails__container__details}>
          <ul className={styles.editUsersDetails__container__details__list}>
            {Object.keys(user)
              .sort(
                (a, b) =>
                  (a === "uploadsUsed" || a === "accountRole" || a === "accountPlan" ? 1 : -1) -
                  (b === "uploadsUsed" || b === "accountRole" || b === "accountPlan" ? 1 : -1)
              )
              .map((key) => {
                if (
                  key === "uid" ||
                  key === "photoURL" ||
                  key === "password" ||
                  key === "accountPlanUpdateDate"
                )
                  return null;

                return (
                  <EditUsersDetailsListItem
                    key={key}
                    uid={user.uid!}
                    username={user.username!}
                    currentUserUsername={currentUserUsername!}
                    title={key as keyof TUserData}
                    value={user[key as keyof TUserData]}
                  />
                );
              })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default EditUsersDetails;

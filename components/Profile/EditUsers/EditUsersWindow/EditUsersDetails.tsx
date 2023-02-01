import Image from "next/image";
import { TUserData } from "../../../../types/globals";

import styles from "./editUsersDetails.module.css";
import EditUsersDetailsListItem from "./EditUsersDetailsListItem";

type TEditUsersDetailsProps = {
  user: TUserData;
  currentUserUsername: string;
};

const listOfKeysToIgnore = [
  "uid",
  "photoURL",
  "password",
  "accountPlanUpdateDate",
  "isPendingAccountPlanUpdate",
];

const getSortedKeys = (user: TUserData) => {
  return Object.keys(user).sort((a, b) => {
    if (a === "uploadsUsed" || a === "accountRole" || a === "accountPlan") return 1;
    if (b === "uploadsUsed" || b === "accountRole" || b === "accountPlan") return -1;
    return 0;
  });
};

const isKeyIgnored = (key: string) => {
  return listOfKeysToIgnore.includes(key);
};

function EditUsersDetails({ user, currentUserUsername }: TEditUsersDetailsProps) {
  return (
    <section className={styles.editUsersDetails__wrapper}>
      <h2 className={styles.editUsersDetails__title}>User Details</h2>

      <div className={styles.editUsersDetails__container}>
        <div className={styles.editUsersDetails__container__profile}>
          <span className={styles.editUsersDetails__container__profile__imageContainer}>
            <Image
              src={user.photoURL ? user.photoURL : "/images/imagerLogo2.png"}
              alt="user profile"
              className={styles.editUsersDetails__container__profile__imageContainer__image}
              width={100}
              height={100}
              priority
            />
          </span>
          <h4 className={styles.editUsersDetails__container__profile__name}>{user.username}</h4>
        </div>

        <div className={styles.editUsersDetails__container__details}>
          <ul className={styles.editUsersDetails__container__details__list}>
            {getSortedKeys(user).map((key) => {
              if (isKeyIgnored(key)) return null;

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

"use client";

import { useAccountPlans, useAppSelector, useUserData } from "../../../hooks/hooks";
import styles from "./editAccountContainer.module.css";
import ChangeAccountPlan from "./ChangeAccountPlan/ChangeAccountPlan";

function EditAccountContainer() {
  const reduxUser = useAppSelector((state) => state.user);
  const { accountPlansData } = useAccountPlans();
  const { userData } = useUserData(reduxUser.uid);

  return (
    <div className={styles.editAccountContainer__wrapper}>
      <h2 className={styles.editAccountContainer__title}>Account Details</h2>

      <section className={styles.editAccountContainer__container}>
        <ChangeAccountPlan
          itemTitle="Current Plan"
          accountPlansData={accountPlansData}
          userData={userData}
          reduxUser={reduxUser}
        />
      </section>
    </div>
  );
}

export default EditAccountContainer;

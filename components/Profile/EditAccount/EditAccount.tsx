"use client";

import { useAccountPlans, useAppSelector, useUserData } from "../../../hooks/hooks";

import ChangeAccountPlan from "./ChangeAccountPlan/ChangeAccountPlan";

import styles from "./editAccount.module.css";

function EditAccount() {
  const reduxUser = useAppSelector((state) => state.user);
  const { accountPlansData } = useAccountPlans();
  const { userData } = useUserData(reduxUser.uid);

  return (
    <div className={styles.editAccountContainer__wrapper}>
      <h2 className={styles.editAccountContainer__title}>Account Details</h2>

      <section className={styles.editAccountContainer__container}>
        <ChangeAccountPlan
          itemTitle="Current Plan"
          reduxUser={reduxUser}
          accountPlansData={accountPlansData}
          userData={userData}
        />
      </section>
    </div>
  );
}

export default EditAccount;

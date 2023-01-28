import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { TAccountPlan, TAccountPlanName, TUserData } from "../../types/globals";
import { choosePlanVariants } from "../../constants/constants";
import { getAccountPlanProperty } from "../../utils/register/registerUtils";

import { IoArrowBackOutline } from "react-icons/io5";
import styles from "./register.module.css";

type TChooseAccountPlanProps = {
  userData: TUserData;
  accountPlans: TAccountPlan[] | undefined;
  selectedAccountPlanName: TAccountPlanName | undefined;
  handleFormStepChange: () => void;
  handleAccountPlanInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSignIn: (userData: TUserData) => void;
};

function ChooseAccountPlan({
  userData,
  accountPlans,
  selectedAccountPlanName,
  handleFormStepChange,
  handleAccountPlanInputChange,
  handleSignIn,
}: TChooseAccountPlanProps) {
  return (
    <div className={styles.accountPlan__formContainer}>
      <h4 className={styles.accountPlan__title}>Choose your plan</h4>

      <form className={styles.accountPlan__form}>
        <div className={styles.accountPlan__radioContainer}>
          {accountPlans?.map((plan) => (
            <div key={`div${plan.name}`}>
              <input
                key={plan.name}
                id={`radioButton${plan.name}`}
                type="radio"
                name="accountPlan"
                value={plan.name}
                className={styles.accountPlan__radioInput}
                onChange={handleAccountPlanInputChange}
                checked={userData.accountPlan === plan.name}
              />
              <label
                key={`label${plan.name}`}
                className={styles.accountPlan__radioLabel}
                htmlFor={`radioButton${plan.name}`}
              >
                {plan.name}
              </label>
            </div>
          ))}
        </div>

        {!!accountPlans && !!selectedAccountPlanName && (
          <AnimatePresence>
            <motion.div
              className={styles.accountPlan__detailsContainer}
              variants={choosePlanVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.accountPlan__detailsHeader}>
                <h4 className={styles.accountPlan__detailsTitle}>{userData.accountPlan}</h4>
                <span
                  className={
                    // add isGold class if plan is gold, isBronze if plan is bronze and isPlatinum if plan is platinum
                    `${styles.accountPlan__price} ${styles["is" + selectedAccountPlanName]}`
                  }
                >
                  {getAccountPlanProperty(accountPlans, selectedAccountPlanName, "price")} €
                </span>
              </div>

              <ul className={styles.accountPlan__detailsList}>
                <li className={styles.accountPlan__detailsItem}>
                  <span className={styles.accountPlan__detailsItemTitle}>Daily upload limit:</span>
                  <span className={styles.accountPlan__detailsItemValue}>
                    {getAccountPlanProperty(accountPlans, selectedAccountPlanName, "dailyUploadLimit")} images
                  </span>
                </li>

                <li className={styles.accountPlan__detailsItem}>
                  <span className={styles.accountPlan__detailsItemTitle}>Max uploaded images:</span>
                  <span className={styles.accountPlan__detailsItemValue}>
                    {getAccountPlanProperty(accountPlans, selectedAccountPlanName, "maxUploadLimit")} images
                  </span>
                </li>

                <li className={styles.accountPlan__detailsItem}>
                  <span className={styles.accountPlan__detailsItemTitle}>Max image size:</span>
                  <span className={styles.accountPlan__detailsItemValue}>
                    {getAccountPlanProperty(accountPlans, selectedAccountPlanName, "uploadSizeLimit")} MB
                  </span>
                </li>
              </ul>
            </motion.div>
          </AnimatePresence>
        )}

        <div className={styles.accountPlan__buttonContainer}>
          <button type="button" className={styles.accountPlan__backButton} onClick={handleFormStepChange}>
            <IoArrowBackOutline className={styles.accountPlan__backIcon} />
          </button>

          <button
            type="button"
            className={styles.accountPlan__ctaButton}
            onClick={() => handleSignIn(userData)}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChooseAccountPlan;

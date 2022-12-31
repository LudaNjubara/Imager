import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TAccountPlan, TAccountPlanName, TUser, TUserData } from "../../../../types/globals";
import database from "../../../../services/Database/Database.class";

import { BsPencilFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import styles from "./changeAccountPlan.module.css";

type TChangeAccountPlanProps = {
  itemTitle: string;
  reduxUser: TUser;
  userData?: TUserData;
  accountPlansData?: TAccountPlan[];
};

function ChangeAccountPlan({ itemTitle, reduxUser, userData, accountPlansData }: TChangeAccountPlanProps) {
  const [currentUserAccountPlan, setCurrentUserAccountPlan] = useState<TAccountPlan>();
  const [currentNewAccountPlanName, setCurrentNewAccountPlanName] = useState<TAccountPlanName>();
  const [isChangePlanButtonChecked, setIsChangePlanButtonChecked] = useState(false);
  const [isSelectNewPlanButtonChecked, setIsSelectNewPlanButtonChecked] = useState(false);
  const [isEligibleForPlanChange, setIsEligibleForPlanChange] = useState(false);

  const handleChangePlanButtonClicked = () => {
    setIsChangePlanButtonChecked((prevState) => !prevState);
    if (isSelectNewPlanButtonChecked) setIsSelectNewPlanButtonChecked(false);
  };

  const handleSelectNewPlanClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    const planName = target.getAttribute("data-plan-name");
    setCurrentNewAccountPlanName(planName as TAccountPlanName);
    setIsSelectNewPlanButtonChecked((prevState) => !prevState);
  };

  const handleConfirmNewPlanClicked = () => {
    if (!currentNewAccountPlanName || !userData || userData?.accountPlan === currentNewAccountPlanName)
      return;

    database.UpdateUserAccountPlan(reduxUser.uid, userData, {
      plan: currentNewAccountPlanName,
      fromProfilePage: true,
    });

    setIsSelectNewPlanButtonChecked(false);
    setCurrentNewAccountPlanName(undefined);
    setIsChangePlanButtonChecked(false);
  };

  useEffect(() => {
    if (!!userData && !!accountPlansData) {
      const currentPlan = accountPlansData.find((plan) => plan.name === userData?.accountPlan);
      setCurrentUserAccountPlan(currentPlan);
      setIsEligibleForPlanChange(
        !!userData?.accountPlanUpdateDate &&
          Date.now() < userData.accountPlanUpdateDate &&
          !!userData?.isPendingAccountPlanUpdate
      );
    }

    return () => {
      setCurrentUserAccountPlan(undefined);
    };
  }, [accountPlansData, userData]);

  useEffect(() => {
    return () => {
      setCurrentNewAccountPlanName(undefined);
    };
  }, []);

  return (
    <article className={styles.changeAccountPlan__item}>
      <h3 className={styles.changeAccountPlan__item__title}>{itemTitle}</h3>

      <div className={styles.changeAccountPlan__item__content}>
        <div className={styles.changeAccountPlan__item__info}>
          <div className={styles.changeAccountPlan__item__info__content}>
            <ul className={styles.changeAccountPlan__item__info__content__list}>
              <li className={styles.changeAccountPlan__item__info__content__list__item}>
                <span className={styles.changeAccountPlan__item__info__content__list__item__title}>
                  Name:
                </span>
                <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                  {currentUserAccountPlan?.name}
                </span>
              </li>
              <li className={styles.changeAccountPlan__item__info__content__list__item}>
                <span className={styles.changeAccountPlan__item__info__content__list__item__title}>
                  Price:
                </span>
                <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                  {currentUserAccountPlan?.price}$
                </span>
              </li>
              <li className={styles.changeAccountPlan__item__info__content__list__item}>
                <span className={styles.changeAccountPlan__item__info__content__list__item__title}>
                  Daily limit:
                </span>
                <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                  {currentUserAccountPlan?.dailyUploadLimit}
                </span>
              </li>
              <li className={styles.changeAccountPlan__item__info__content__list__item}>
                <span className={styles.changeAccountPlan__item__info__content__list__item__title}>
                  Max upload limit:
                </span>
                <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                  {currentUserAccountPlan?.maxUploadLimit}
                </span>
              </li>
              <li className={styles.changeAccountPlan__item__info__content__list__item}>
                <span className={styles.changeAccountPlan__item__info__content__list__item__title}>
                  Upload size limit:
                </span>
                <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                  {currentUserAccountPlan?.uploadSizeLimit} MB
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.changeAccountPlan__item__buttonContainer}>
          <button
            type="button"
            className={styles.changeAccountPlan__item__buttonContainer__button}
            onClick={handleChangePlanButtonClicked}
          >
            Change
            <BsPencilFill className={styles.changeAccountPlan__item__buttonContainer__button__icon} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isChangePlanButtonChecked && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto", transition: { duration: 0.8 } }}
            exit={{ height: 0, transition: { duration: 0.5 } }}
            className={styles.changeAccountPlan__item__plansContainer}
          >
            {isEligibleForPlanChange && (
              <motion.div
                initial={{ y: -30 }}
                animate={{ y: 0, transition: { duration: 0.5 } }}
                exit={{ y: -30, transition: { duration: 0.5 } }}
                className={styles.changeAccountPlan__item__plansContainer__pendingUpdate}
              >
                <p className={styles.changeAccountPlan__item__plansContainer__pendingUpdate__text}>
                  Your account plan is pending account plan update. Please check back later.
                </p>
              </motion.div>
            )}
            {accountPlansData?.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
                className={styles.changeAccountPlan__item__plansContainer__plan}
              >
                <div className={styles.changeAccountPlan__item__plansContainer__plan__content}>
                  <ul className={styles.changeAccountPlan__item__info__content__list}>
                    <li className={styles.changeAccountPlan__item__info__content__list__item}>
                      <span
                        className={`${styles.changeAccountPlan__item__info__content__list__item__title} ${styles.newPlan}`}
                      >
                        Name:
                      </span>
                      <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                        {plan?.name}
                      </span>
                    </li>
                    <li className={styles.changeAccountPlan__item__info__content__list__item}>
                      <span
                        className={`${styles.changeAccountPlan__item__info__content__list__item__title} ${styles.newPlan}`}
                      >
                        Price:
                      </span>
                      <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                        {plan?.price}$
                      </span>
                    </li>
                    <li className={styles.changeAccountPlan__item__info__content__list__item}>
                      <span
                        className={`${styles.changeAccountPlan__item__info__content__list__item__title} ${styles.newPlan}`}
                      >
                        Daily limit:
                      </span>
                      <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                        {plan?.dailyUploadLimit}
                      </span>
                    </li>
                    <li className={styles.changeAccountPlan__item__info__content__list__item}>
                      <span
                        className={`${styles.changeAccountPlan__item__info__content__list__item__title} ${styles.newPlan}`}
                      >
                        Max upload limit:
                      </span>
                      <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                        {plan?.maxUploadLimit}
                      </span>
                    </li>
                    <li className={styles.changeAccountPlan__item__info__content__list__item}>
                      <span
                        className={`${styles.changeAccountPlan__item__info__content__list__item__title} ${styles.newPlan}`}
                      >
                        Upload size limit:
                      </span>
                      <span className={styles.changeAccountPlan__item__info__content__list__item__value}>
                        {plan?.uploadSizeLimit} MB
                      </span>
                    </li>
                  </ul>
                </div>

                <div className={styles.changeAccountPlan__item__plansContainer__plan__buttonContainer}>
                  <button
                    type="button"
                    data-plan-name={plan.name}
                    disabled={isEligibleForPlanChange || userData?.accountPlan === plan.name}
                    className={`${styles.changeAccountPlan__item__plansContainer__plan__button} ${
                      currentNewAccountPlanName === plan.name && styles.isActive
                    } ${
                      currentNewAccountPlanName === plan.name && isSelectNewPlanButtonChecked && styles.cancel
                    }`}
                    onClick={handleSelectNewPlanClicked}
                  >
                    {isSelectNewPlanButtonChecked && currentNewAccountPlanName === plan.name
                      ? "Cancel"
                      : "Select"}
                  </button>

                  <AnimatePresence>
                    {isSelectNewPlanButtonChecked && currentNewAccountPlanName === plan.name && (
                      <motion.button
                        initial={{ opacity: 0, x: 12 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { ease: "linear" },
                        }}
                        exit={{
                          x: 12,
                          opacity: 0,
                          transition: { ease: "linear" },
                        }}
                        type="button"
                        data-plan-name={plan.name}
                        disabled={userData?.accountPlan === plan.name}
                        className={`${styles.changeAccountPlan__item__plansContainer__plan__button} ${styles.isActive} ${styles.confirm}`}
                        onClick={handleConfirmNewPlanClicked}
                      >
                        <IoCheckmarkDoneSharp
                          className={styles.changeAccountPlan__item__plansContainer__plan__button__icon}
                        />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default ChangeAccountPlan;

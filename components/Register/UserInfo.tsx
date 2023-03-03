import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { loginAndRegister__messageVariants } from "../../constants/constants";
import { TRegisterProvider, TUserData, TUserDataError } from "../../types/globals";

import styles from "./register.module.css";

type TUserInfoProps = {
  userData: TUserData;
  userDataError: TUserDataError;
  currentRegisterProvider: TRegisterProvider;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleProviderInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormStepChange: () => void;
  validateForm: () => boolean;
};

function UserInfo({
  userData,
  userDataError,
  currentRegisterProvider,
  handleInputChange,
  handleProviderInputChange,
  handleFormStepChange,
  validateForm,
}: TUserInfoProps) {
  return (
    <div className={styles.userInfo__formContainer}>
      <h4 className={styles.userInfo__title}>Choose your provider</h4>

      <form className={styles.userInfo__form}>
        <div className={styles.userInfo__radioContainer}>
          <input
            id="radioButtonEmail"
            type="radio"
            name="registerProvider"
            value="Email"
            className={styles.userInfo__radioInput}
            onChange={handleProviderInputChange}
            checked={currentRegisterProvider === "Email"}
          />
          <label className={styles.userInfo__radioLabel} htmlFor="radioButtonEmail">
            Email
          </label>

          <input
            id="radioButtonGoogle"
            type="radio"
            name="registerProvider"
            value="Google"
            className={styles.userInfo__radioInput}
            onChange={handleProviderInputChange}
            checked={currentRegisterProvider === "Google"}
          />
          <label className={styles.userInfo__radioLabel} htmlFor="radioButtonGoogle">
            Google
          </label>

          <input
            id="radioButtonGithub"
            type="radio"
            name="registerProvider"
            value="GitHub"
            className={styles.userInfo__radioInput}
            onChange={handleProviderInputChange}
            checked={currentRegisterProvider === "GitHub"}
          />
          <label className={styles.userInfo__radioLabel} htmlFor="radioButtonGithub">
            GitHub
          </label>
        </div>

        {currentRegisterProvider === "Email" && (
          <AnimatePresence>
            <label htmlFor="usernameInput" key="usernameInput">
              <input
                type="text"
                id="usernameInput"
                name="username"
                placeholder="Username.."
                className={styles.userInfo__input}
                value={userData.username}
                onChange={handleInputChange}
              />
            </label>

            {userDataError.username?.message && (
              <motion.p
                key="usernameError"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {userDataError.username.message}
              </motion.p>
            )}

            <label htmlFor="emailInput" key="emailInput">
              <input
                type="email"
                id="emailInput"
                name="email"
                placeholder="Email.."
                className={styles.userInfo__input}
                value={userData.email}
                onChange={handleInputChange}
              />
            </label>

            {userDataError.email?.message && (
              <motion.p
                key="emailError"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {userDataError.email.message}
              </motion.p>
            )}

            <label htmlFor="passwordInput" key="passwordInput">
              <input
                type="password"
                id="passwordInput"
                name="password"
                placeholder="Password.."
                className={styles.userInfo__input}
                value={userData.password}
                onChange={handleInputChange}
              />
            </label>

            {userDataError.password?.message && (
              <motion.p
                key="passwordError"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {userDataError.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        )}

        <button
          type="button"
          className={styles.register__ctaButton}
          onClick={() => {
            if (currentRegisterProvider === "Email") {
              if (validateForm()) handleFormStepChange();
            }
          }}
        >
          Continue to next step
        </button>
      </form>
    </div>
  );
}

export default UserInfo;

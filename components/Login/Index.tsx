import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { TLoginProvider, TUserData, TUserDataError } from "../../types/globals";
import { emailRegex, loginAndRegister__messageVariants } from "../../constants/constants";
import { auth } from "../../config/firebaseConfig";
import login from "../../services/Login/Login.class";

import LogoutFirst from "../common/LogoutFirst/Index";

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaMask } from "react-icons/fa";
import styles from "./login.module.css";
import { validateEmail } from "../../utils/common/utils";
import { validatePassword } from "../../utils/register/registerUtils";

function LoginForm() {
  const [user, loading, error] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState<string | undefined>(undefined);

  const [userData, setUserData] = useState<TUserData>({
    email: "",
    password: "",
  });

  const [userDataError, setUserDataError] = useState<TUserDataError>({
    email: {
      message: undefined,
    },
    password: {
      message: undefined,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    setFirebaseErrorMessage(undefined);

    const emailCheck = validateEmail(userData.email);
    const passwordCheck = validatePassword(userData.password);

    setUserDataError((prev) => {
      return {
        ...prev,
        email: {
          message: emailCheck.message,
        },
        password: {
          message: passwordCheck.message,
          containsEnoughCharacters: passwordCheck.password.containsEnoughCharacters,
          containsUpperCaseCharacter: passwordCheck.password.containsUpperCaseCharacter,
          containsLowerCaseCharacter: passwordCheck.password.containsLowerCaseCharacter,
          containsNumber: passwordCheck.password.containsNumber,
        },
      };
    });
  };

  const handleEmailLogin = () => {
    validateForm();
    setIsSubmitting(true);
  };

  const handleLogin = (providerId: TLoginProvider) => {
    login.ChangeStrategy(providerId);
    login.Login(userData);
  };

  useEffect(() => {
    if (isSubmitting && !userDataError.email.message && !userDataError.password.message) {
      handleLogin("Email");
    }
  }, [isSubmitting, userDataError]);

  return (
    <div id={styles.loginWrapper}>
      {!loading && (
        <div className={styles.login__formContainer}>
          <h4 className={styles.login__title}>
            {!user || user?.isAnonymous ? "Log in" : "Already logged in"}
          </h4>

          {user && !user.isAnonymous && <LogoutFirst />}

          {(!user || user?.isAnonymous) && (
            <>
              <AnimatePresence>
                {firebaseErrorMessage && (
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={loginAndRegister__messageVariants}
                    className={styles.login__warningMessage}
                  >
                    {firebaseErrorMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <form className={styles.login__inputContainer}>
                <label htmlFor="emailInput">
                  <input
                    type="email"
                    id="emilInput"
                    name="email"
                    placeholder="Email.."
                    className={styles.login__input}
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </label>
                <AnimatePresence>
                  {userDataError.email?.message && (
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={loginAndRegister__messageVariants}
                      className={styles.login__errorMessage}
                    >
                      {userDataError.email?.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <label htmlFor="passwordInput">
                  <input
                    type="password"
                    id="passwordInput"
                    name="password"
                    placeholder="Password.."
                    className={styles.login__input}
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                </label>
                <AnimatePresence>
                  {userDataError.password?.message && (
                    <motion.p
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={loginAndRegister__messageVariants}
                      className={styles.login__errorMessage}
                    >
                      {userDataError.password?.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className={`${styles.login__loginButton} ${styles.login__emailButton}`}
                  onClick={handleEmailLogin}
                >
                  Log in
                </button>
              </form>

              <div className={styles.login__buttonsContainer}>
                <button
                  type="button"
                  className={styles.login__loginButton}
                  onClick={() => handleLogin("Google")}
                >
                  Continue with Google
                  <FcGoogle className={styles.login__loginButtonIcon} />
                </button>
                <button
                  type="button"
                  className={styles.login__loginButton}
                  onClick={() => handleLogin("GitHub")}
                >
                  Continue with GitHub
                  <BsGithub className={styles.login__loginButtonIcon} />
                </button>
                {!user && (
                  <button
                    type="button"
                    className={styles.login__loginButton}
                    onClick={() => handleLogin("Anonymous")}
                  >
                    Continue as Guest
                    <FaMask className={styles.login__loginButtonIcon} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginForm;

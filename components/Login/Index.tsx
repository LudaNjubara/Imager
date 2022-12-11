import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { TLoginProvider, TUserData, TUserDataError } from "../../types/globals";
import { emailRegex, loginAndRegister__messageVariants } from "../../constants/constants";
import { auth } from "../../config/firebaseConfig";
import login from "../../services/Login/Login.class";

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaMask } from "react-icons/fa";
import styles from "./login.module.css";
import LogoutFirst from "../common/LogoutFirst/LogoutFirst";

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

  // validate email and password in an arrow function
  const validateEmailAndPassword = () => {
    setFirebaseErrorMessage(undefined);

    if (userData.email.length === 0) {
      setUserDataError((prev) => {
        return { ...prev, email: { message: "Email is required" } };
      });
    } else if (!userData.email.match(emailRegex)) {
      setUserDataError((prev) => {
        return { ...prev, email: { message: "Email is not valid" } };
      });
    } else {
      setUserDataError((prev) => {
        return {
          ...prev,
          email: { message: "" },
        };
      });
    }

    if (userData.password.length === 0) {
      setUserDataError((prev) => {
        return { ...prev, password: { message: "Password is required" } };
      });
    } else {
      setUserDataError((prev) => {
        return { ...prev, password: { message: "" } };
      });
    }
  };

  const handleEmailLogin = () => {
    validateEmailAndPassword();
    setIsSubmitting(true);
  };

  const handleLogin = (providerId: TLoginProvider) => {
    login.ChangeStrategy(providerId);
    login.Login();
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

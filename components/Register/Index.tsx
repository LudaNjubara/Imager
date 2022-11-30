import { useEffect, useState, FormEvent, ChangeEvent } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import {
  emailRegex,
  loginAndRegister__messageVariants,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  passwordRegex,
  usernameRegex,
} from "../../constants/constants";
import { TEmailUserData, TEmailUserError } from "../../app/globals";
import { auth } from "../../config/firebaseConfig";

import styles from "./register.module.css";

function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailUser, setEmailUser] = useState<TEmailUserData>({
    username: "",
    email: "",
    password: "",
  });

  const [emailUserError, setEmailUserError] = useState<TEmailUserError>({
    username: {
      message: undefined,
    },
    email: {
      message: undefined,
    },
    password: {
      message: undefined,
      containsEnoughCharacters: false,
      containsUpperCaseCharacter: false,
      containsLowerCaseCharacter: false,
      containsNumber: false,
    },
  });

  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState<string | undefined>(undefined);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailUser({ ...emailUser, [name]: value });
  };

  const validateForm = () => {
    setFirebaseErrorMessage(undefined);

    if (!emailUser.username) {
      setEmailUserError({
        ...emailUserError,
        username: {
          message: "Username is required",
        },
      });
    } else if (!usernameRegex.test(emailUser.username)) {
      setEmailUserError({
        ...emailUserError,
        username: {
          message: "Username is not valid",
        },
      });
    } else {
      setEmailUserError({
        ...emailUserError,
        username: {
          message: "",
        },
      });
    }

    if (emailUser.email.length === 0) {
      setEmailUserError((prev) => {
        return { ...prev, email: { message: "Email is required" } };
      });
    } else if (!emailRegex.test(emailUser.email)) {
      setEmailUserError((prev) => {
        return { ...prev, email: { message: "Email is not valid" } };
      });
    } else {
      setEmailUserError((prev) => {
        return {
          ...prev,
          email: { message: "" },
        };
      });
    }

    if (emailUser.password.length === 0) {
      setEmailUserError((prev) => {
        return { ...prev, password: { message: "Password is required" } };
      });
    } else if (!passwordRegex.test(emailUser.password)) {
      setEmailUserError((prev) => {
        return {
          ...prev,
          password: {
            message: "Password is not valid",
            containsEnoughCharacters:
              emailUser.password.length >= MIN_PASSWORD_LENGTH &&
              emailUser.password.length <= MAX_PASSWORD_LENGTH,
            containsUpperCaseCharacter: !!emailUser.password.match(/[A-Z]/),
            containsLowerCaseCharacter: !!emailUser.password.match(/[a-z]/),
            containsNumber: !!emailUser.password.match(/[0-9]/),
          },
        };
      });
    } else {
      setEmailUserError((prev) => {
        return { ...prev, password: { message: "" } };
      });
    }
  };

  const handleEmailSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (
      isSubmitting &&
      emailUserError.username &&
      emailUserError.username.message === "" &&
      emailUserError.email.message === "" &&
      emailUserError.password.message === ""
    ) {
      createUserWithEmailAndPassword(auth, emailUser.email, emailUser.password)
        .then(({ user }) => {
          updateProfile(user, {
            displayName: emailUser.username,
          }).catch((error) => {
            if (error.code === "auth/invalid-display-name") {
              setFirebaseErrorMessage("Username is not valid");
            } else if (error.code === "auth/display-name-too-long") {
              setFirebaseErrorMessage("Username is too long");
            }
          });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setFirebaseErrorMessage("Email already in use");
          }
        });
    }
  }, [isSubmitting, emailUserError]);

  return (
    <div id={styles.registerWrapper}>
      <div id={styles.register__formContainer}>
        <h4 className={styles.register__title}>Register</h4>

        <AnimatePresence>
          {firebaseErrorMessage && (
            <motion.p
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={loginAndRegister__messageVariants}
              className={styles.register__warningMessage}
            >
              {firebaseErrorMessage}
            </motion.p>
          )}
        </AnimatePresence>
        <form onSubmit={handleEmailSignIn} className={styles.register__inputContainer}>
          <label htmlFor="usernameInput">
            <input
              type="text"
              id="usernameInput"
              name="username"
              placeholder="Username.."
              className={styles.register__input}
              value={emailUser.username}
              onChange={handleInputChange}
            />
          </label>
          <AnimatePresence>
            {emailUserError.username?.message && (
              <motion.p
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {emailUserError.username?.message}
              </motion.p>
            )}
          </AnimatePresence>

          <label htmlFor="emailInput">
            <input
              type="email"
              id="emailInput"
              name="email"
              placeholder="Email.."
              className={styles.register__input}
              value={emailUser.email}
              onChange={handleInputChange}
            />
          </label>
          <AnimatePresence>
            {emailUserError.email?.message && (
              <motion.p
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {emailUserError.email?.message}
              </motion.p>
            )}
          </AnimatePresence>

          <label htmlFor="passwordInput">
            <input
              type="password"
              id="passwordInput"
              name="password"
              placeholder="Password.."
              className={styles.register__input}
              value={emailUser.password}
              onChange={handleInputChange}
            />
          </label>
          <AnimatePresence>
            {emailUserError.password?.message && (
              <motion.p
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={loginAndRegister__messageVariants}
                className={styles.register__errorMessage}
              >
                {emailUserError.password?.message}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className={`${styles.register__registerButton} ${styles.register__emailButton}`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;

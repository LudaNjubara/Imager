import { useEffect, useState } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { loginAndRegister__messageVariants } from "../../constants/constants";
import { auth } from "../../config/firebaseConfig";

import styles from "./register.module.css";

interface IEmailUser {
  username: string;
  email: string;
  password: string;
}

type IEmailUserError = {
  username: {
    message: string;
  };
  email: {
    message?: string;
  };
  password: {
    message?: string;
    containsEnoughCharacters?: boolean;
    containsUpperCaseCharacter?: boolean;
    containsLowerCaseCharacter?: boolean;
    containsNumber?: boolean;
  };
};

function RegisterForm() {
  const [user, loading, error] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [emailUser, setEmailUser] = useState<IEmailUser>({
    username: "",
    email: "",
    password: "",
  });

  const [emailUserError, setEmailUserError] = useState<IEmailUserError>({
    username: {
      message: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailUser({ ...emailUser, [name]: value });
  };

  // validate email and password in an arrow function
  const validateForm = () => {
    const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    // password regex
    // at leaast 6 characters
    // at least one uppercase letter
    // at least one lowercase letter
    // at least one number
    // at least one special character
    // no spaces
    // max 16 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,16}$/;
    // username regex
    // at least 3 characters
    // max 16 characters
    // no special characters
    const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;

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
    }
    // password must be at least 6 characters and no more than 15 characters and must include at least one upper case letter, one lower case letter, and one numeric digit. It can have special characters.
    else if (!passwordRegex.test(emailUser.password)) {
      setEmailUserError((prev) => {
        return {
          ...prev,
          password: {
            message: "Password is not valid",
            containsEnoughCharacters: emailUser.password.length >= 6 && emailUser.password.length <= 15,
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

  const handleEmailSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (
      isSubmitting &&
      emailUserError.username.message === "" &&
      emailUserError.email.message === "" &&
      emailUserError.password.message === ""
    ) {
      createUserWithEmailAndPassword(auth, emailUser.email, emailUser.password)
        .then(({ user }) => {
          updateProfile(user, {
            displayName: emailUser.username,
          })
            .then(() => {
              router.push("/");
            })
            .catch((error) => {
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

import { useEffect, useState } from "react";

import {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { loginAndRegister__messageVariants } from "../../constants/constants";
import { authProviderFactory } from "../../services/authProviderFactory";
import { auth } from "../../config/firebaseConfig";
import { useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../redux/userSlice";

import Loading from "../Loading/Index";

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { FaMask } from "react-icons/fa";
import styles from "./login.module.css";

interface IEmailUser {
  email: string;
  password: string;
}

type IEmailUserError = {
  email: {
    message?: string;
  };
  password: {
    message?: string;
  };
};

function LoginForm() {
  const [user, loading, error] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState<string | undefined>(undefined);

  const [emailUser, setEmailUser] = useState<IEmailUser>({
    email: "",
    password: "",
  });

  const [emailUserError, setEmailUserError] = useState<IEmailUserError>({
    email: {
      message: undefined,
    },
    password: {
      message: undefined,
    },
  });

  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch(logout());
    });
  };

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then(({ user }) => {
        router.push("/");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailUser({ ...emailUser, [name]: value });
  };

  // validate email and password in an arrow function
  const validateEmailAndPassword = () => {
    const emailRegex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    setFirebaseErrorMessage(undefined);

    if (emailUser.email.length === 0) {
      setEmailUserError((prev) => {
        return { ...prev, email: { message: "Email is required" } };
      });
    } else if (!emailUser.email.match(emailRegex)) {
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
    } else {
      setEmailUserError((prev) => {
        return { ...prev, password: { message: "" } };
      });
    }
  };

  const handleEmailSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateEmailAndPassword();
    setIsSubmitting(true);
  };

  const handleFederateSignIn = (providerId: string) => {
    const provider = authProviderFactory(providerId);
    // add scope for getting displayName
    if (providerId === "google") provider.instance.addScope("profile");
    else if (providerId === "github") provider.instance.addScope("user");

    if (user) {
      const currentUser = user;

      linkWithPopup(currentUser, provider.instance)
        .then(({ user }) => {
          // Accounts successfully linked.
          router.push("/");
        })
        .catch((error) => {
          if (error.code === "auth/credential-already-in-use") {
            signInWithRedirect(auth, provider.instance)
              .then(({ user }) => {
                router.push("/");
              })
              .catch((error) => {
                // Handle Errors here.
                // ...
                console.error("error", error);
              });
          }
        });
    } else {
      signInWithPopup(auth, provider.instance)
        .then(({ user }) => {
          router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    if (isSubmitting && emailUserError.email.message === "" && emailUserError.password.message === "") {
      signInWithEmailAndPassword(auth, emailUser.email, emailUser.password)
        .then(({ user }) => {
          router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
          if (error.code === "auth/user-not-found") {
            setFirebaseErrorMessage("No such user");
          } else if (error.code === "auth/wrong-password") {
            setFirebaseErrorMessage("Wrong password");
          }
        });
    }
  }, [isSubmitting, emailUserError]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          // User is signed in.

          router.push("/");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <div id={styles.loginWrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div id={styles.login__formContainer}>
          <h4 className={styles.login__title}>
            {!user || user?.isAnonymous ? "Log in" : "Already logged in"}
          </h4>

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

              <form onSubmit={handleEmailSignIn} className={styles.login__inputContainer}>
                <label htmlFor="emailInput">
                  <input
                    type="email"
                    id="emilInput"
                    name="email"
                    placeholder="Email.."
                    className={styles.login__input}
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
                      className={styles.login__errorMessage}
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
                    className={styles.login__input}
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
                      className={styles.login__errorMessage}
                    >
                      {emailUserError.password?.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" className={`${styles.login__loginButton} ${styles.login__emailButton}`}>
                  Log in
                </button>
              </form>

              <div className={styles.login__buttonsContainer}>
                <button
                  type="button"
                  className={styles.login__loginButton}
                  onClick={() => handleFederateSignIn("google")}
                >
                  Continue with Google
                  <FcGoogle className={styles.login__loginButtonIcon} />
                </button>
                <button
                  type="button"
                  className={styles.login__loginButton}
                  onClick={() => handleFederateSignIn("github")}
                >
                  Continue with GitHub
                  <BsGithub className={styles.login__loginButtonIcon} />
                </button>
                {!user && (
                  <button type="button" className={styles.login__loginButton} onClick={anonymousSignIn}>
                    Continue as Guest
                    <FaMask className={styles.login__loginButtonIcon} />
                  </button>
                )}
              </div>
            </>
          )}

          {user && !user?.isAnonymous && (
            <>
              <p className={styles.login__message}>Log out before logging in as another user.</p>
              <button type="button" className={styles.login__logoutButton} onClick={handleSignOut}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginForm;

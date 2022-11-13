import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";

import { auth } from "../../config/firebaseConfig";
import { useAppDispatch } from "../../hooks/hooks";
import { login } from "../../redux/userSlice";

function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then(({ user }) => {
        dispatch(
          login({
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            providerId: user.providerId,
            metadata: {
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime,
            },
          })
        );
        console.log("User signed in anonymously: ", user);
        router.push("/");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <button type="button" onClick={anonymousSignIn}>
      Sign in anonymously
    </button>
  );
}

export default LoginForm;

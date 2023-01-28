import { signInWithPopup, signInWithEmailAndPassword, signInAnonymously, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { EAccountPlanName, TUserData } from "../../types/globals";
import { authProviderFactory } from "../authProviderFactory";
import facade from "../facade.class"

export default class LoginStrategy {
    static Anonymous() {
        signInAnonymously(auth).catch((error) => {
            console.error(error);
        });
    }

    static Email(userData: TUserData) {
        const { email, password } = userData

        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    /* Implement client side logging of errors and warnings */
                } else if (error.code === "auth/wrong-password") {
                    /* Implement client side logging of errors and warnings */
                }
            });
    }

    static Google() {
        const provider = authProviderFactory("Google");

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const additionalUserInfo = getAdditionalUserInfo(result);
                const { user } = result;

                if (additionalUserInfo?.isNewUser) {
                    try {
                        const userData: TUserData = {
                            email: user?.email!,
                            password: "",
                            username: user?.displayName ?? user?.providerData[0]?.displayName!,
                            photoURL: user?.photoURL ?? user?.providerData[0]?.photoURL ?? null,
                            accountPlan: EAccountPlanName.Bronze,
                            accountRole: "User",
                            uploadsUsed: 0,
                        }

                        facade.AddUser(userData, user.uid);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    static GitHub() {
        const provider = authProviderFactory("GitHub");

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const additionalUserInfo = getAdditionalUserInfo(result);
                const { user } = result;

                try {
                    if (additionalUserInfo?.isNewUser) {
                        const userData: TUserData = {
                            email: user?.email!,
                            password: "",
                            username: user?.displayName ?? user?.
                                providerData[0]?.displayName!,
                            photoURL: user?.photoURL ?? user?.providerData[0]?.photoURL ?? null,
                            accountPlan: EAccountPlanName.Bronze,
                            accountRole: "User",
                            uploadsUsed: 0,
                        }

                        facade.AddUser(userData, user.uid);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
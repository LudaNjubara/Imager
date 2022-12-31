import { createUserWithEmailAndPassword, linkWithPopup, signInWithPopup, signInWithRedirect, updateProfile, linkWithRedirect, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { TUserData } from "../../types/globals";
import { authProviderFactory } from "../authProviderFactory";
import database from "../Database/Database.class";
import logger from "../Logger/Logger.class";

export default class RegisterProviderStrategy {
    static Email(userData: TUserData) {
        const { email, password, username } = userData

        createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                updateProfile(user, {
                    displayName: username,
                })
                    .then(() => {
                        database.AddUser(userData, user.uid);
                    })
                    .catch((error) => {
                        if (error.code === "auth/invalid-display-name") {
                            /* Implement client side logging of errors and warnings */
                        } else if (error.code === "auth/display-name-too-long") {
                            /* Implement client side logging of errors and warnings */
                        }
                    });
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    /* Implement client side logging of errors and warnings */
                }
            });
    }

    static Google(userData: TUserData) {
        const provider = authProviderFactory("Google");
        provider.instance.addScope("profile");

        const prevUser = auth.currentUser;

        if (!prevUser) {
            signInWithPopup(auth, provider.instance)
                .then((result) => {
                    const additionalUserInfo = getAdditionalUserInfo(result);
                    const { user } = result;

                    if (additionalUserInfo?.isNewUser) {
                        userData.email = user.email!;
                        userData.username = user?.displayName ?? user.providerData[0]?.displayName!;
                        userData.photoURL = user?.photoURL ?? user.providerData[0]?.photoURL!;

                        database.AddUser(userData, user.uid);
                    }
                }).catch((error) => {
                    console.error("error", error);
                });
        } else if (prevUser.isAnonymous) {
            linkWithPopup(prevUser, provider.instance)
                .catch((error) => {
                    if (error.code === "auth/credential-already-in-use") {
                        linkWithRedirect(prevUser, provider.instance).catch((error) => {
                            console.error("error", error);
                        });
                    }
                });
        }
    }

    static GitHub(userData: TUserData) {
        const provider = authProviderFactory("GitHub");
        provider.instance.addScope("user");

        const prevUser = auth.currentUser;

        if (!prevUser) {
            signInWithPopup(auth, provider.instance)
                .then((result) => {
                    const additionalUserInfo = getAdditionalUserInfo(result);
                    const { user } = result;

                    if (additionalUserInfo?.isNewUser) {
                        userData.email = user.email!;
                        userData.username = user?.displayName ?? user.providerData[0]?.displayName!;
                        userData.photoURL = user?.photoURL ?? user.providerData[0]?.photoURL!;

                        database.AddUser(userData, user.uid);
                    }
                }).catch((error) => {
                    console.error("error", error);
                });
        } else if (prevUser.isAnonymous) {
            linkWithPopup(prevUser, provider.instance)
                .catch((error) => {
                    if (error.code === "auth/credential-already-in-use") {
                        signInWithRedirect(auth, provider.instance).catch((error) => {
                            console.error("error", error);
                        });
                    }
                });
        }

    }
}
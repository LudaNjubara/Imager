import { createUserWithEmailAndPassword, linkWithPopup, signInWithPopup, signInWithRedirect, updateProfile, linkWithRedirect, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { TUserData } from "../../types/globals";
import { authProviderFactory } from "../authProviderFactory";
import facade from "../facade.class"

export default class RegisterProviderStrategy {
    static Email(userData: TUserData) {
        const { email, password, username } = userData

        createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                updateProfile(user, {
                    displayName: username,
                })
                    .then(() => {
                        try {
                            facade.AddUser(userData, user.uid);
                        }
                        catch (error) {
                            console.error(error);
                        }
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
        provider.addScope("profile");

        const prevUser = auth.currentUser;

        if (!prevUser) {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const additionalUserInfo = getAdditionalUserInfo(result);
                    const { user } = result;

                    if (additionalUserInfo?.isNewUser) {
                        try {
                            userData.email = user.email!;
                            userData.username = user?.displayName ?? user.providerData[0]?.displayName!;
                            userData.photoURL = user?.photoURL ?? user.providerData[0]?.photoURL!;

                            facade.AddUser(userData, user.uid);
                        }
                        catch (error) {
                            console.error(error);
                        }

                    }
                }).catch((error) => {
                    console.error(error);
                });
        } else if (prevUser.isAnonymous) {
            linkWithPopup(prevUser, provider)
                .catch((error) => {
                    if (error.code === "auth/credential-already-in-use") {
                        linkWithRedirect(prevUser, provider).catch((error) => {
                            console.error(error);
                        });
                    }
                });
        }
    }

    static GitHub(userData: TUserData) {
        const provider = authProviderFactory("GitHub");
        provider.addScope("user");

        const prevUser = auth.currentUser;

        if (!prevUser) {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const additionalUserInfo = getAdditionalUserInfo(result);
                    const { user } = result;

                    if (additionalUserInfo?.isNewUser) {
                        try {
                            userData.email = user.email!;
                            userData.username = user?.displayName ?? user.providerData[0]?.displayName!;
                            userData.photoURL = user?.photoURL ?? user.providerData[0]?.photoURL!;

                            facade.AddUser(userData, user.uid);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                });
        } else if (prevUser.isAnonymous) {
            linkWithPopup(prevUser, provider)
                .catch((error) => {
                    if (error.code === "auth/credential-already-in-use") {
                        signInWithRedirect(auth, provider).catch((error) => {
                            console.error(error);
                        });
                    }
                });
        }

    }
}
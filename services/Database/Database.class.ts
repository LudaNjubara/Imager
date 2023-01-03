import { collection, doc, addDoc, GeoPoint, increment, setDoc, updateDoc } from "firebase/firestore";
import { TAccountPlanName, TImageInfo, TLogData, TUserData } from "../../types/globals";
import { db } from "../../config/firebaseConfig";
import logger from "../Logger/Logger.class";
import { detectBrowser, detectOS, getUserLocation } from "../../utils/common/utils";

interface IDatabase {
    AddUser: (userData: TUserData, uid: string) => void;
    UpdateImageInfo: (description: string, hashtags: string[], key: string, username: string) => void;
    UpdateUserUploadsUsed: (value: "increment" | "decrement", uid: string) => void;
    UpdateUserAccountPlan: (uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) => void;
    AddImageInfo: (imageInfo: TImageInfo) => void;
    UpdateUserField: (userUsername: string, adminUsername: string, uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) => void;
}

class Database implements IDatabase {
    private static instance: Database;
    private constructor() { }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    AddUser(userData: TUserData, uid: string) {
        const {
            email,
            username,
            accountRole,
            accountPlan,
            uploadsUsed,
            photoURL
        } = userData

        const userRef = doc(db, "users", uid);
        setDoc(userRef, {
            uid,
            email,
            username,
            accountRole,
            accountPlan,
            uploadsUsed,
            photoURL: photoURL ?? null
        })
            .then(() => {
                logger.Log(username!, {
                    url: window.location.href,
                    type: "log",
                    title: "User created",
                    description: `Created an account with ${accountPlan} account plan`,
                    data: null
                });
            })
            .catch((error) => {
                throw new Error(error);
            });
    }

    UpdateImageInfo(description: string, hashtags: string[], key: string, username: string) {
        const docRef = doc(db, `images/${key}`);

        updateDoc(docRef, {
            description,
            hashtags
        })
            .then(() => {
                logger.Log(username, {
                    url: window.location.href,
                    type: "log",
                    title: "Image updated",
                    description: `Updated image information. Image key ${key}`,
                    data: null
                });
            })
            .catch((error) => {
                throw new Error(error);
            });
    }


    UpdateUserUploadsUsed(value: "increment" | "decrement", uid: string) {
        const userRef = doc(db, "users", uid);

        if (value === "increment") {
            return updateDoc(userRef, {
                uploadsUsed: increment(1)
            }).catch((error) => {
                throw new Error(error);
            });;
        } else if (value === "decrement") {
            return updateDoc(userRef, {
                uploadsUsed: increment(-1)
            }).catch((error) => {
                throw new Error(error);
            });
        }
    }

    UpdateUserAccountPlan(uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) {
        const userRef = doc(db, "users", uid);
        const isEligibleForPlanUpdate = !!userData?.accountPlanUpdateDate && userData?.accountPlanUpdateDate < Date.now() && userData?.isPendingAccountPlanUpdate;

        if (isEligibleForPlanUpdate) {
            setDoc(userRef, {
                accountPlan: userData.pendingAccountPlan,
                isPendingAccountPlanUpdate: false,
                pendingAccountPlan: null,
                uploadsUsed: 0,
                accountPlanUpdateDate: null,
            }, { merge: true })
                .then(() => {
                    logger.Log(userData.username!, {
                        url: window.location.href,
                        type: "log",
                        title: "Account plan updated",
                        description: `Updated account plan to ${userData.accountPlan}`,
                        data: null
                    });
                })
        } else {
            if (!fromProfilePage) return;

            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            const nextDayInMilliseconds = nextDay.getTime();

            setDoc(userRef, {
                accountPlanUpdateDate: nextDayInMilliseconds,
                isPendingAccountPlanUpdate: true,
                pendingAccountPlan: plan,
            }, { merge: true })
                .then(() => {
                    logger.Log(userData.username!, {
                        url: window.location.href,
                        type: "log",
                        title: "Scheduled account plan update",
                        description: `Scheduled an account plan update from ${userData.accountPlan} to ${plan}`,
                        data: null
                    });
                })

        }
    }

    AddImageInfo(imageInfo: TImageInfo) {
        const docRef = doc(db, `images/${imageInfo.key}`);

        setDoc(docRef, imageInfo)
            .then(() => {
                console.log("Document written with ID: ", docRef.id);

                logger.Log(imageInfo.uploaderDisplayName!, {
                    url: window.location.href,
                    type: "log",
                    title: "Image uploaded",
                    description: `Uploaded an image with key ${imageInfo.key}`,
                    data: null
                })
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    UpdateUserField(userUsername: string, adminUsername: string, uid: string, fieldName: keyof TUserData, value: string | number | boolean | null,) {
        const userRef = doc(db, "users", uid);

        updateDoc(userRef, {
            [fieldName]: value
        })
            .then(() => {
                logger.Log(userUsername, {
                    url: window.location.href,
                    type: "log",
                    title: "User data updated (admin)",
                    description: `Admin ${adminUsername} updated user's ${fieldName} to ${value}`,
                    data: null
                });
            })
            .catch((error) => {
                throw new Error(error);
            });
    }

    LogUserAction(logData: TLogData) {
        const docRef = collection(db, "logs");

        addDoc(docRef, logData)
            .then((docRef) => {
                console.log("Log written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding log: ", error);
            });
    }
}

const database = Object.freeze(Database.getInstance());

export default database;
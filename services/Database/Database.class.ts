import { collection, doc, addDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { TAccountPlanName, TImageInfo, TLogData, TUserData } from "../../types/globals";
import { db } from "../../config/firebaseConfig";
import logger from "../Logger/Logger.class";
import { getNextDayInMilliseconds } from "../../utils/common/utils";

interface IDatabase {
    AddUser: (userData: TUserData, uid: string) => void;
    UpdateImageInfo: (description: string, hashtags: string[], key: string, username: string) => void;
    UpdateUserUploadsUsed: (value: "increment" | "decrement", uid: string) => void;
    UpdateUserAccountPlan: (uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) => void;
    AddImageInfo: (imageInfo: TImageInfo) => void;
    UpdateUserField: (uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) => void;
}

class Database implements IDatabase {
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

    UpdateUserAccountPlan(uid: string, userData: TUserData) {
        const userRef = doc(db, "users", uid);

        setDoc(userRef, {
            accountPlan: userData.pendingAccountPlan,
            isPendingAccountPlanUpdate: false,
            pendingAccountPlan: null,
            uploadsUsed: 0,
            accountPlanUpdateDate: null,
        }, { merge: true })
            .catch(() => {
                throw new Error("Error updating to new account plan");
            })
    }

    SetPendingUserAccountPlan(uid: string, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) {
        const userRef = doc(db, "users", uid);

        setDoc(userRef, {
            accountPlanUpdateDate: getNextDayInMilliseconds(),
            isPendingAccountPlanUpdate: true,
            pendingAccountPlan: plan,
        }, { merge: true })
            .catch(() => {
                throw new Error("Error setting pending account plan");
            })
    }

    AddImageInfo(imageInfo: TImageInfo) {
        const docRef = doc(db, `images/${imageInfo.key}`);

        setDoc(docRef, imageInfo)
            .catch((error) => {
                throw new Error(error);
            });
    }

    UpdateUserField(uid: string, fieldName: keyof TUserData, value: string | number | boolean | null,) {
        const userRef = doc(db, "users", uid);

        updateDoc(userRef, {
            [fieldName]: value
        })
            .catch((error) => {
                throw new Error(error);
            });
    }

    LogUserAction(logData: TLogData) {
        const docRef = collection(db, "logs");

        addDoc(docRef, logData)
            .catch((error) => {
                throw new Error(error);
            });
    }
}

const database = Object.freeze(new Database);

export default database;
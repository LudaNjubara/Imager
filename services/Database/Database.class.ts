import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { TAccountPlanName, TImageInfo, TUserData } from "../../types/globals";
import { db } from "../../config/firebaseConfig";
import logger from "../Logger/Logger.class";

interface IDatabase {
    AddUser: (userData: TUserData, uid: string) => void;
    UpdateImageInfo: (description: string, hashtags: string[], key: string) => void;
    UpdateUserUploadsUsed: (value: "increment" | "decrement", uid: string) => void;
    UpdateUserAccountPlan: (uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) => void;
    AddImageInfo: (imageInfo: TImageInfo) => void;
    UpdateUserField: (uid: string, fieldName: string, value: string | number | boolean | null) => void;
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
        }).catch((error) => {
            throw new Error(error);
        });
    }

    UpdateImageInfo(description: string, hashtags: string[], key: string) {
        const docRef = doc(db, `images/${key}`);

        updateDoc(docRef, {
            description,
            hashtags
        }).catch((error) => {
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

        }
    }

    AddImageInfo(imageInfo: TImageInfo) {
        const docRef = doc(db, `images/${imageInfo.key}`);

        setDoc(docRef, imageInfo)
            .then(() => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    UpdateUserField(uid: string, fieldName: string, value: string | number | boolean | null) {
        const userRef = doc(db, "users", uid);

        updateDoc(userRef, {
            [fieldName]: value
        }).catch((error) => {
            throw new Error(error);
        });
    }
}

const database = Object.freeze(Database.getInstance());

export default database;
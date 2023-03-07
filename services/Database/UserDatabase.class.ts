import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { TAccountPlanName, TUserData } from "../../types/globals";

export interface IUserDatabase {
    AddUser: (userData: TUserData, uid: string) => void;
    UpdateUserField: (uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) => void;
    UpdateUserUploadsUsed: (value: "increment" | "decrement", uid: string) => void;
}

export class UserDatabase implements IUserDatabase {
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
}
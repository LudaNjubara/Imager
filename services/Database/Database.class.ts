import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { TImageInfo, TUserData } from "../../types/globals";
import { db } from "../../config/firebaseConfig";

interface IDatabase {
    AddUser: (userData: TUserData, uid: string) => void;
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
        } = userData

        const userRef = doc(db, "users", uid);
        setDoc(userRef, {
            email,
            username,
            accountRole,
            accountPlan,
            uploadsUsed,
        })
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
}

const database = Database.getInstance();

export default database;
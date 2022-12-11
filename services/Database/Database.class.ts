import { doc, setDoc } from "firebase/firestore";
import { TUserData } from "../../types/globals";
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
            dailyUploadLimit,
            maxUploadLimit,
            uploadSizeLimit,
            accountPlan,
            uploadsUsed,
        } = userData

        const userRef = doc(db, "users", uid);
        setDoc(userRef, {
            email,
            username,
            accountRole,
            dailyUploadLimit,
            maxUploadLimit,
            uploadSizeLimit,
            accountPlan,
            uploadsUsed,
        })
    }
}

const database = Database.getInstance();

export default database;
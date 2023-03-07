import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { TLogData } from "../../types/globals";

export interface ILoggingDatabase {
    LogUserAction: (logData: TLogData) => void;
}

export class LoggingDatabase implements ILoggingDatabase {
    LogUserAction(logData: TLogData) {
        const docRef = collection(db, "logs");

        addDoc(docRef, logData)
            .catch((error) => {
                throw new Error(error);
            });
    }
}
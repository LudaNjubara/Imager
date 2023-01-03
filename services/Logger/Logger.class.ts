import { GeoPoint } from "firebase/firestore";
import { TLogData, TLogAction } from "../../types/globals";
import { detectBrowser, detectOS, getUserLocation } from "../../utils/common/utils";
import database from "../Database/Database.class";

interface ILogger {
    Log(username: string, action: TLogAction): void;
}

class Logger implements ILogger {

    Log(username: string, action: TLogAction) {
        const logData: TLogData = {
            username,
            time: Date.now(),
            location: "unknown",
            userAgent: {
                browser: detectBrowser(),
                os: detectOS()
            },
            action
        };

        getUserLocation()
            .then(({ latitude, longitude }) => {
                logData.location = new GeoPoint(latitude, longitude);
                database.LogUserAction(logData);
            })
            .catch((error) => {
                database.LogUserAction(logData);
            });
    }
}

const logger = Object.freeze(new Logger());

export default logger;
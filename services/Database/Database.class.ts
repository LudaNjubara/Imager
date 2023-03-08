import userDatabase, { IUserDatabase } from "./UserDatabase.class";
import imagesDatabase, { IImagesDatabase } from "./ImagesDatabase.class";
import loggingDatabase, { ILoggingDatabase } from "./LoggingDatabase.class";

import { TAccountPlanName, TImageInfo, TLogData, TUserData } from "../../types/globals";

interface IDatabase extends IUserDatabase, IImagesDatabase, ILoggingDatabase { }

class Database implements IDatabase {

    constructor(
        private readonly userDatabase: IUserDatabase,
        private readonly imagesDatabase: IImagesDatabase,
        private readonly loggingDatabase: ILoggingDatabase,
    ) { }

    AddUser(userData: TUserData, uid: string) {
        this.userDatabase.AddUser(userData, uid);
    }

    UpdateUserField(uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) {
        this.userDatabase.UpdateUserField(uid, fieldName, value);
    }

    UpdateUserUploadsUsed(value: "increment" | "decrement", uid: string) {
        this.userDatabase.UpdateUserUploadsUsed(value, uid);
    }

    UpdateUserAccountPlan(uid: string, userData: TUserData) {
        this.userDatabase.UpdateUserAccountPlan(uid, userData);
    }

    SetPendingUserAccountPlan(uid: string, plan?: TAccountPlanName) {
        this.userDatabase.SetPendingUserAccountPlan(uid, plan);
    }

    UpdateImageInfo(description: string, hashtags: string[], key: string) {
        this.imagesDatabase.UpdateImageInfo(description, hashtags, key);
    }

    AddImageInfo(imageInfo: TImageInfo) {
        this.imagesDatabase.AddImageInfo(imageInfo);
    }

    LogUserAction(logData: TLogData) {
        this.loggingDatabase.LogUserAction(logData);
    }
}

const database = Object.freeze(
    new Database(
        userDatabase,
        imagesDatabase,
        loggingDatabase,
    )
);

export default database;

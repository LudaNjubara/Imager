import { IUserDatabase, UserDatabase } from "./UserDatabase.class";
import { IImagesDatabase, ImagesDatabase } from "./ImagesDatabase.class";
import { ILoggingDatabase, LoggingDatabase } from "./LoggingDatabase.class";
import { IAccountPlansDatabase, AccountPlansDatabase } from "./AccountPlansDatabase.class";

import { TAccountPlanName, TImageInfo, TLogData, TUserData } from "../../types/globals";

// join all interfaces into one interface called IDatabase
interface IDatabase extends IUserDatabase, IAccountPlansDatabase, IImagesDatabase, ILoggingDatabase { }

class Database implements IDatabase {
    private readonly userDatabase: IUserDatabase;
    private readonly accountPlansDatabase: IAccountPlansDatabase;
    private readonly imagesDatabase: IImagesDatabase;
    private readonly loggingDatabase: ILoggingDatabase;

    constructor(userDatabase: IUserDatabase, accountPlansDatabase: IAccountPlansDatabase, imagesDatabase: IImagesDatabase, loggingDatabase: ILoggingDatabase) {
        this.userDatabase = userDatabase;
        this.accountPlansDatabase = accountPlansDatabase;
        this.imagesDatabase = imagesDatabase;
        this.loggingDatabase = loggingDatabase;
    }

    AddUser(userData: TUserData, uid: string) {
        this.userDatabase.AddUser(userData, uid);
    }

    UpdateUserField(uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) {
        this.userDatabase.UpdateUserField(uid, fieldName, value);
    }

    UpdateUserUploadsUsed(value: "increment" | "decrement", uid: string) {
        this.userDatabase.UpdateUserUploadsUsed(value, uid);
    }

    UpdateImageInfo(description: string, hashtags: string[], key: string) {
        this.imagesDatabase.UpdateImageInfo(description, hashtags, key);
    }

    AddImageInfo(imageInfo: TImageInfo) {
        this.imagesDatabase.AddImageInfo(imageInfo);
    }

    UpdateUserAccountPlan(uid: string, userData: TUserData) {
        this.accountPlansDatabase.UpdateUserAccountPlan(uid, userData);
    }

    SetPendingUserAccountPlan(uid: string, plan?: TAccountPlanName) {
        this.accountPlansDatabase.SetPendingUserAccountPlan(uid, plan);
    }

    LogUserAction(logData: TLogData) {
        this.loggingDatabase.LogUserAction(logData);
    }
}

const database = Object.freeze(
    new Database(
        new UserDatabase(),
        new AccountPlansDatabase(),
        new ImagesDatabase(),
        new LoggingDatabase()
    )
);

export default database;

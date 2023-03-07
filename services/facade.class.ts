import logger from "./Logger/Logger.class";
import database from "./Database/Database.class";

import { TAccountPlanName, TImageInfo, TUserData } from "../types/globals";

interface IFacade {
    AddUser: (userData: TUserData, uid: string) => void;
    UpdateImageInfo: (description: string, hashtags: string[], key: string, username: string) => void;
    UpdateUserAccountPlan: (uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) => void;
    AddImageInfo: (imageInfo: TImageInfo, uid: string) => void;
    UpdateUserField: (userUsername: string, adminUsername: string, uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) => void;
}

class Facade implements IFacade {
    static logger = logger;
    static database = database;

    AddUser(userData: TUserData, uid: string) {
        database.AddUser(userData, uid);

        logger.Log(userData.username!, {
            url: window.location.href,
            type: "log",
            title: "User created",
            description: `Created an account with ${userData.accountPlan} account plan`,
            data: null
        });
    }

    UpdateImageInfo(description: string, hashtags: string[], key: string, username: string) {
        database.UpdateImageInfo(description, hashtags, key);

        logger.Log(username, {
            url: window.location.href,
            type: "log",
            title: "Image info updated",
            description: `Updated image information. Image key ${key}`,
            data: null
        });
    }

    UpdateUserAccountPlan(uid: string, userData: TUserData, { plan, fromProfilePage }: { plan?: TAccountPlanName, fromProfilePage: boolean }) {

        const isEligibleForPlanUpdate = !!userData?.accountPlanUpdateDate && userData?.accountPlanUpdateDate < Date.now() && userData?.isPendingAccountPlanUpdate;

        if (isEligibleForPlanUpdate) {
            database.UpdateUserAccountPlan(uid, userData)

            logger.Log(userData.username!, {
                url: window.location.href,
                type: "log",
                title: "Account plan updated",
                description: `Updated account plan to ${plan}`,
                data: null
            });
        } else {
            if (!fromProfilePage) return;

            database.SetPendingUserAccountPlan(uid, plan);

            logger.Log(userData.username!, {
                url: window.location.href,
                type: "log",
                title: "Scheduled account plan update",
                description: `Scheduled an account plan update from ${userData.accountPlan} to ${plan}`,
                data: null
            });
        }
    }

    AddImageInfo(imageInfo: TImageInfo, uid: string) {
        database.AddImageInfo(imageInfo);
        database.UpdateUserUploadsUsed("increment", uid);

        logger.Log(imageInfo.uploaderDisplayName!, {
            url: window.location.href,
            type: "log",
            title: "Image uploaded",
            description: `Uploaded an image with key ${imageInfo.key}`,
            data: null
        })
    }

    UpdateUserField(userUsername: string, adminUsername: string, uid: string, fieldName: keyof TUserData, value: string | number | boolean | null) {
        database.UpdateUserField(uid, fieldName, value);

        logger.Log(userUsername, {
            url: window.location.href,
            type: "log",
            title: "User data updated (admin)",
            description: `Admin ${adminUsername} updated user's ${fieldName} to ${value}`,
            data: null
        });
    }
}

const facade = Object.freeze(new Facade());
export default facade;
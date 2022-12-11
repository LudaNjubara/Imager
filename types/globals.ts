import { FieldValue, Timestamp } from "firebase/firestore";

interface userMetadata {
    creationTime?: string;
    lastSignInTime?: string;
}

type TFederalProvider = "Google" | "GitHub";
type TRegisterProvider = "Email" | "Google" | "GitHub";
type TLoginProvider = "Email" | "Google" | "GitHub" | "Anonymous";
type TAccountPlanName = "Bronze" | "Gold" | "Platinum";
type TAccountRole = "Admin" | "User";

type TUser = {
    readonly uid: string,
    displayName: string | null,
    email: string | null,
    photoURL: string | null,
    readonly emailVerified: boolean
    readonly isAnonymous: boolean,
    metadata: userMetadata,
    phoneNumber: string | null,
    readonly providerId: string
}

type TUserData = {
    username?: string,
    email: string;
    password: string;
    accountPlan?: TAccountPlanName;
    accountRole?: TAccountRole;
    maxUploadLimit?: number;
    dailyUploadLimit?: number;
    uploadSizeLimit?: number;
    uploadsUsed?: number;
};

type TUserDataError = {
    username?: {
        message?: string;
    };
    email: {
        message?: string;
    };
    password: {
        message?: string;
        containsEnoughCharacters?: boolean;
        containsUpperCaseCharacter?: boolean;
        containsLowerCaseCharacter?: boolean;
        containsNumber?: boolean;
    };
    accountPlan?: {
        message?: string;
    };
};

type TImageInfo = {
    key: string,
    fileType: string,
    size: number,
    hashtags: string[],
    description: string,
    uploaderUID: string,
    uploaderDisplayName: string | null,
    uploadDate: Timestamp | FieldValue,
}

type TAccountPlan = {
    name: string,
    price: number,
    uploadSizeLimit: number,
    dailyUploadLimit: number,
    maxUploadLimit: number,
}

export type { TUser, TUserData, TUserDataError, TImageInfo, TFederalProvider, TRegisterProvider, TLoginProvider, TAccountPlan, TAccountPlanName, TAccountRole };
import { GeoPoint } from "firebase/firestore";

/* Enums */
enum EAccountPlanName {
    Bronze = "Bronze",
    Gold = "Gold",
    Platinum = "Platinum"
}

enum EAccountRole {
    Admin = "Admin",
    User = "User"
}

/* Types */
type userMetadata = {
    creationTime?: string;
    lastSignInTime?: string;
}
type TFederalProvider = "Google" | "GitHub";
type TRegisterProvider = "Email" | "Google" | "GitHub";
type TLoginProvider = "Email" | "Google" | "GitHub" | "Anonymous";
type TAccountPlanName = "Bronze" | "Gold" | "Platinum";
type TAccountRole = "Admin" | "User";
type TSearchFilter = "date" | "size" | "author" | "hashtags" | "extension";

type TUser = {
    readonly uid: string,
    displayName: string | null,
    email: string | null,
    photoURL?: string | null,
    readonly emailVerified: boolean
    readonly isAnonymous: boolean,
    metadata: userMetadata,
    phoneNumber: string | null,
    readonly providerId: string
}

type TUserData = {
    uid?: string,
    username?: string,
    email: string;
    password: string;
    photoURL?: string | null,
    accountPlan?: TAccountPlanName;
    accountRole?: TAccountRole;
    uploadsUsed?: number;
    accountPlanUpdateDate?: number | null;
    isPendingAccountPlanUpdate?: boolean;
    pendingAccountPlan?: TAccountPlanName | null;
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
    width: number,
    height: number,
    hashtags: string[],
    description: string,
    uploaderUID: string,
    uploaderDisplayName: string | null,
    uploaderPhotoURL?: string | null,
    uploadDate: number,
}

type TAccountPlan = {
    name: string,
    price: number,
    uploadSizeLimit: number,
    dailyUploadLimit: number,
    maxUploadLimit: number,
}

type TLogAction = {
    url: string;
    type: "log" | "warn" | "error" | "unknown";
    title: string;
    description: string;
    data: any;
}

type TLogData = {
    username: string;
    time: number;
    location: GeoPoint | "unknown";
    userAgent: {
        browser: string;
        os: string;
    }
    action: TLogAction;
}

/* export enums  */
export { EAccountPlanName, EAccountRole };

/* export types  */
export type { TUser, TUserData, TUserDataError, TImageInfo, TFederalProvider, TRegisterProvider, TLoginProvider, TAccountPlan, TLogAction, TLogData, TAccountPlanName, TSearchFilter };
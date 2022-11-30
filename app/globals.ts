import { FieldValue, Timestamp } from "firebase/firestore";

interface userMetadata {
    creationTime?: string;
    lastSignInTime?: string;
}

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

type TEmailUserData = {
    username?: string,
    email: string;
    password: string;
};

type TEmailUserError = {
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

export type { TUser, TEmailUserData, TEmailUserError, TImageInfo }
interface userMetadata {
    creationTime?: string;
    lastSignInTime?: string;
}

type TUser = {
    readonly uid: string,
    displayName?: string | null,
    email?: string | null,
    photoURL?: string | null,
    readonly emailVerified: boolean
    readonly isAnonymous: boolean,
    metadata: userMetadata,
    phoneNumber?: string | null,
    readonly providerId: string
}

export type { TUser }
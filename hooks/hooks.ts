import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'

import type { RootState, AppDispatch } from '../redux/store'
import { db } from '../config/firebaseConfig'
import { TAccountPlan, TImageInfo, TLogData, TSearchFilter, TUserData } from '../types/globals'
import { convertImageKeysToString } from '../utils/common/utils'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const accountPlansFetcher = async () => {
    const accountPlansSnapshot = await getDocs(collection(db, "AccountPlans"))
    const accountPlans = accountPlansSnapshot.docs.map((doc) => doc.data());

    return accountPlans as TAccountPlan[];
}

export const useAccountPlans = () => {
    const { data, error } = useSWR('getaccountplans', accountPlansFetcher, {
        revalidateOnFocus: false,
    });

    return {
        accountPlansData: data,
        isLoading: !error && !data,
        isError: error
    }
}

const userDataFetcher = async (swrKey: string) => {
    const uid = swrKey.split('_')[1];

    const data = await getDoc(doc(db, `users/${uid}`))
        .then((doc) => {
            return doc.data()
        })

    return data as TUserData;
}

export const useUserData = (uid: string | null | undefined) => {
    const { data, error } = useSWR(uid ? `getuserdata_${uid}` : null, userDataFetcher);

    return {
        userData: data,
        isLoading: !error && !data,
        isError: error
    }
}

const latestUploadsImagesFetcher = async () => {
    const q = query(collection(db, "images"), orderBy("uploadDate", "desc"), limit(10));
    const latestUploadsImagesSnapshot = await getDocs(q)

    const data = latestUploadsImagesSnapshot.docs.map((doc) => doc.data());

    return data as TImageInfo[];
}

export const useLatestUploadsImages = () => {
    const { data, error } = useSWR('getlatestuploadsimages', latestUploadsImagesFetcher, { revalidateOnFocus: false });

    return {
        latestUploadsImagesData: data,
        isLoading: !error && !data,
        isError: error
    }
}

const allUserImagesFetcher = async () => {
    const q = query(collection(db, "images"), orderBy("uploadDate", "desc"));
    const allUserImagesSnapshot = await getDocs(q)

    const data = allUserImagesSnapshot.docs.map((doc) => doc.data());

    return data as TImageInfo[];
}

export const useAllUserImages = () => {
    const { data, error } = useSWR("getallusersimages", allUserImagesFetcher, { revalidateOnFocus: false });

    return {
        allUsersImagesData: data,
        isLoading: !error && !data,
        isError: error
    }
}
const currentUserImagesFetcher = async (swrKey: string) => {
    const uid = swrKey.split('_')[1];

    const q = query(collection(db, "images"), where("uploaderUID", "==", uid), orderBy("uploadDate", "desc"));
    const currentUserImagesSnapshot = await getDocs(q)

    const data = currentUserImagesSnapshot.docs.map((doc) => doc.data());

    return data as TImageInfo[];
}

export const useCurrentUserImages = (uid: string) => {
    const { data, error } = useSWR(`getcurrentuserimages_${uid}`, currentUserImagesFetcher, { revalidateOnFocus: false });

    return {
        currentUserImagesData: data,
        isLoading: !error && !data,
        isError: error
    }
}

const getAWSImageURLsFetcher = async (swrKey: string) => {
    const data = await fetch(swrKey)
        .then((res) => {
            return res.json();
        })

    return data as string[];
}

export const useAWSImageURLs = (array: TImageInfo[]) => {
    const imageKeys = convertImageKeysToString(array);

    const { data, error } = useSWR(
        imageKeys
            ? `/api/getimages?imageKeys=${encodeURIComponent(imageKeys)}`
            : null,
        getAWSImageURLsFetcher,
        { revalidateOnFocus: false }
    );

    return {
        imageURLsData: data,
        isURLsLoading: !error && !data,
        isError: error
    }
}

const userLogsFetcher = async () => {
    const q = query(collection(db, "logs"), orderBy("time", "desc"), orderBy("username", "asc"));
    const userLogsSnapshot = await getDocs(q)

    const data = userLogsSnapshot.docs.map((doc) => {
        return doc.data()
    });

    return data as TLogData[];
}

export const useUserLogs = () => {
    const { data, error } = useSWR("getuserlogs", userLogsFetcher, { revalidateOnFocus: false });

    return {
        userLogsData: data,
        isLoading: !error && !data,
        isError: error
    }
}

export const searchImages = async (searchFilter: TSearchFilter, searchQuery: string, dateSearchQuery?: {
    from?: number,
    to?: number
}) => {
    const results: TImageInfo[] = [];

    switch (searchFilter) {
        case "author":
            {
                const q = query(collection(db, "images"), where("uploaderDisplayName", "==", searchQuery));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    results.push(doc.data() as TImageInfo);
                });
            }
            break;

        case "size":
            {
                const transformedSearchQuery = parseFloat(searchQuery) * 1000000;
                const q = query(collection(db, "images"), where("size", "<=", transformedSearchQuery));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    results.push(doc.data() as TImageInfo);
                }
                );
            }
            break;
        case "extension":
            {
                const q = query(collection(db, "images"), where("extension", "==", searchQuery.toUpperCase()));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    results.push(doc.data() as TImageInfo);
                }
                );
            }
            break;
        case "hashtags":
            {
                const q = query(collection(db, "images"), where("hashtags", "array-contains-any", searchQuery.split(" ")));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    results.push(doc.data() as TImageInfo);
                }
                );
            }
            break;
        case "date":
            {
                const q = query(collection(db, "images"), orderBy("uploadDate", "desc"), where("uploadDate", ">=", dateSearchQuery?.from), where("uploadDate", "<=", dateSearchQuery?.to));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    results.push(doc.data() as TImageInfo);
                });
            }
            break;

        default:
            break;
    }

    return results;
}
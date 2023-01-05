import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { collection, doc, endAt, getDoc, getDocs, limit, orderBy, query, startAt, where } from 'firebase/firestore'

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

    return accountPlans;
}

export const useAccountPlans = () => {
    const { data, error } = useSWR('getaccountplans', accountPlansFetcher, {
        revalidateOnFocus: false,
    });

    return {
        accountPlansData: data as unknown as TAccountPlan[],
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

    return data;
}
export const useUserData = (uid: string | null | undefined) => {
    const { data, error } = useSWR(uid ? `getuserdata_${uid}` : null, userDataFetcher);

    return {
        userData: data as unknown as TUserData,
        isLoading: !error && !data,
        isError: error
    }
}

const latestUploadsImagesFetcher = async () => {
    /* With query */
    const q = query(collection(db, "images"), orderBy("uploadDate", "desc"), limit(10));
    const latestUploadsImagesSnapshot = await getDocs(q)

    const data = latestUploadsImagesSnapshot.docs.map((doc) => doc.data());

    return data;
}

export const useLatestUploadsImages = () => {
    const { data, error } = useSWR('getlatestuploadsimages', latestUploadsImagesFetcher, { revalidateOnFocus: false });

    return {
        latestUploadsImagesData: data as unknown as TImageInfo[],
        isLoading: !error && !data,
        isError: error
    }
}

const allUserImagesFetcher = async () => {
    const q = query(collection(db, "images"), orderBy("uploadDate", "desc"));
    const allUserImagesSnapshot = await getDocs(q)

    const data = allUserImagesSnapshot.docs.map((doc) => doc.data());

    return data;
}

export const useAllUserImages = () => {
    const { data, error } = useSWR("getallusersimages", allUserImagesFetcher, { revalidateOnFocus: false });

    return {
        allUsersImagesData: data as unknown as TImageInfo[],
        isLoading: !error && !data,
        isError: error
    }
}
const currentUserImagesFetcher = async (swrKey: string) => {
    const uid = swrKey.split('_')[1];

    const q = query(collection(db, "images"), where("uploaderUID", "==", uid), orderBy("uploadDate", "desc"));
    const currentUserImagesSnapshot = await getDocs(q)

    const data = currentUserImagesSnapshot.docs.map((doc) => doc.data());

    return data;
}

export const useCurrentUserImages = (uid: string) => {
    const { data, error } = useSWR(`getcurrentuserimages_${uid}`, currentUserImagesFetcher, { revalidateOnFocus: false });

    return {
        currentUserImagesData: data as unknown as TImageInfo[],
        isLoading: !error && !data,
        isError: error
    }
}

const getAWSImageURLsFetcher = async (swrKey: string) => {
    const data = await fetch(swrKey)
        .then((res) => {
            return res.json();
        })

    return data;
}

export const useAWSImageURLs = (array: TImageInfo[]) => {
    const imageKeys = convertImageKeysToString(array);

    const { data, error } = useSWR(imageKeys ? `/api/getimages?imageKeys=${encodeURIComponent(imageKeys)}` : null, getAWSImageURLsFetcher, { revalidateOnFocus: false });

    return {
        imageURLsData: data as unknown as string[],
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

    return data;
}

export const useUserLogs = () => {
    const { data, error } = useSWR("getuserlogs", userLogsFetcher, { revalidateOnFocus: false });

    return {
        userLogsData: data as unknown as TLogData[],
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
                const q = query(collection(db, "images"), where("fileType", "==", searchQuery.toUpperCase()));
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
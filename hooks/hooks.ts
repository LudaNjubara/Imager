import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore'

import type { RootState, AppDispatch } from '../redux/store'
import { db } from '../config/firebaseConfig'
import { TAccountPlan, TImageInfo, TUserData } from '../types/globals'
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
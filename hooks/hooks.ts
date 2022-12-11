import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { TAccountPlan } from '../types/globals'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAccountPlans = async () => {
    const accountPlansSnapshot = await getDocs(collection(db, "AccountPlans"));
    const accountPlans = accountPlansSnapshot.docs.map((doc) => doc.data());

    // set account plans to state
    return accountPlans as TAccountPlan[];

}
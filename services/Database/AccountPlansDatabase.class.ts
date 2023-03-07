import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { TAccountPlanName, TUserData } from "../../types/globals";
import { getNextDayInMilliseconds } from "../../utils/common/utils";

export interface IAccountPlansDatabase {
    UpdateUserAccountPlan: (uid: string, userData: TUserData) => void;
    SetPendingUserAccountPlan: (uid: string, plan?: TAccountPlanName) => void;
}

export class AccountPlansDatabase implements IAccountPlansDatabase {
    UpdateUserAccountPlan(uid: string, userData: TUserData) {
        const userRef = doc(db, "users", uid);

        setDoc(userRef, {
            accountPlan: userData.pendingAccountPlan,
            isPendingAccountPlanUpdate: false,
            pendingAccountPlan: null,
            uploadsUsed: 0,
            accountPlanUpdateDate: null,
        }, { merge: true })
            .catch(() => {
                throw new Error("Error updating to new account plan");
            })
    }

    SetPendingUserAccountPlan(uid: string, plan?: TAccountPlanName) {
        const userRef = doc(db, "users", uid);

        setDoc(userRef, {
            accountPlanUpdateDate: getNextDayInMilliseconds(),
            isPendingAccountPlanUpdate: true,
            pendingAccountPlan: plan,
        }, { merge: true })
            .catch(() => {
                throw new Error("Error setting pending account plan");
            })
    }
}
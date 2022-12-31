import { collection, getDocs, orderBy, query, startAt, where } from "firebase/firestore";

import { EAccountPlanName, EAccountRole, TUserData } from "../../types/globals";
import { emailRegex, usernameRegex } from "../../constants/constants";
import { db } from "../../config/firebaseConfig";

const validateDetailsInput = (title: keyof TUserData, inputValue: string) => {
    switch (title) {
        case "uploadsUsed":
            if (isNaN(parseInt(inputValue))) return false;
            return true;
        case "accountRole":
            if (inputValue !== EAccountRole.Admin && inputValue !== EAccountRole.User)
                return false;
            return true;
        case "accountPlan":
            if (
                inputValue !== EAccountPlanName.Bronze &&
                inputValue !== EAccountPlanName.Gold &&
                inputValue !== EAccountPlanName.Platinum
            )
                return false;
            return true;
        case "username":
            if (!usernameRegex.test(inputValue)) return false;
            return true;
        case "email":
            if (!emailRegex.test(inputValue)) return false;
            return true;
        default:
            return false;
    }
};

const searchUsers = async (searchQuery: string) => {
    let isError;
    let data: TUserData[] = [];
    try {
        const q = query(
            collection(db, "users"),
            orderBy("username"),
            startAt(searchQuery),
            where("username", ">=", searchQuery),
            where("username", "<=", searchQuery + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);
        data = querySnapshot.docs.map((doc) => doc.data() as TUserData);

    } catch (error) {
        console.log(error);
        isError = error;
    }

    return {
        searchedUsersData: data,
        isLoading: !isError && !data,
        isError
    }
}

export { validateDetailsInput, searchUsers }
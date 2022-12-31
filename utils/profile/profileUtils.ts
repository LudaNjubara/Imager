import { emailRegex, usernameRegex } from "../../constants/constants";
import { EAccountPlanName, EAccountRole, TUserData } from "../../types/globals";

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

export { validateDetailsInput }
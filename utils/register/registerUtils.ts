import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, passwordRegex } from "../../constants/constants";
import { TAccountPlan, TAccountPlanName, TUserData } from "../../types/globals";

const getAccountPlanProperty = (accountPlans: TAccountPlan[], accountPlanName: TAccountPlanName, property: keyof TAccountPlan) => {
    const accountPlan = accountPlans.find((plan) => plan.name === accountPlanName);


    if (!accountPlan) {
        throw new Error(`No account plan with name ${accountPlanName} found!`);
    }

    return accountPlan[property];
}

const validatePassword = (userData: TUserData) => {
    let message = ""
    let isValid = false
    let password: {
        message: string,
        containsEnoughCharacters: boolean,
        containsUpperCaseCharacter: boolean,
        containsLowerCaseCharacter: boolean,
        containsNumber: boolean,
    } = {
        message: message,
        containsEnoughCharacters: false,
        containsUpperCaseCharacter: false,
        containsLowerCaseCharacter: false,
        containsNumber: false,
    }

    if (userData.password.length === 0) {
        message = "Password is required"
    } else if (!passwordRegex.test(userData.password)) {
        message = "Password is not valid"
        password = {
            message: message,
            containsEnoughCharacters:
                userData.password.length >= MIN_PASSWORD_LENGTH &&
                userData.password.length <= MAX_PASSWORD_LENGTH,
            containsUpperCaseCharacter: !!userData.password.match(/[A-Z]/),
            containsLowerCaseCharacter: !!userData.password.match(/[a-z]/),
            containsNumber: !!userData.password.match(/[0-9]/),
        }
    } else {
        isValid = true
    }

    return {
        message,
        isValid,
        password
    }
};

export { getAccountPlanProperty, validatePassword }
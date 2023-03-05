import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, passwordRegex } from "../../constants/constants";
import { TAccountPlan, TAccountPlanName } from "../../types/globals";

const getAccountPlanProperty = (accountPlans: TAccountPlan[], accountPlanName: TAccountPlanName, property: keyof TAccountPlan) => {
    const accountPlan = accountPlans.find((plan) => plan.name === accountPlanName);


    if (!accountPlan) {
        throw new Error(`No account plan with name ${accountPlanName} found!`);
    }

    return accountPlan[property];
}

const validatePassword = (passwordToValidate: string) => {
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

    if (passwordToValidate.length === 0) {
        message = "Password is required"
    } else if (!passwordRegex.test(passwordToValidate)) {
        message = "Password is not valid"
        password = {
            message: message,
            containsEnoughCharacters:
                passwordToValidate.length >= MIN_PASSWORD_LENGTH &&
                passwordToValidate.length <= MAX_PASSWORD_LENGTH,
            containsUpperCaseCharacter: !!passwordToValidate.match(/[A-Z]/),
            containsLowerCaseCharacter: !!passwordToValidate.match(/[a-z]/),
            containsNumber: !!passwordToValidate.match(/[0-9]/),
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
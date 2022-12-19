import { TAccountPlan, TAccountPlanName } from "../../types/globals";

const getAccountPlanProperty = (accountPlans: TAccountPlan[], accountPlanName: TAccountPlanName, property: keyof TAccountPlan) => {
    const accountPlan = accountPlans.find((plan) => plan.name === accountPlanName);


    if (!accountPlan) {
        throw new Error(`No account plan with name ${accountPlanName} found!`);
    }

    return accountPlan[property];
}

export { getAccountPlanProperty }
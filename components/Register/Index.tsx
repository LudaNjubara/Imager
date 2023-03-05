import { useEffect, useState, ChangeEvent } from "react";
import { getRedirectResult } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  TAccountPlanName,
  TUserData,
  TUserDataError,
  TRegisterProvider,
  EAccountPlanName,
} from "../../types/globals";
import { getAccountPlanProperty, validatePassword } from "../../utils/register/registerUtils";
import { useAccountPlans } from "../../hooks/hooks";
import createAccount from "../../services/Register/CreateAccount.class";
import observableRegisterProvider, {
  ObserverRegisterProvider,
} from "../../services/Register/ObservableRegisterProvider.class";
import { auth } from "../../config/firebaseConfig";

import UserInfo from "./UserInfo";
import ChooseAccountPlan from "./ChoosePlan";

import styles from "./register.module.css";
import LogoutFirst from "../common/LogoutFirst/Index";
import { validateEmail, validateUsername } from "../../utils/common/utils";

type TActiveFormSteps = "userInfo" | "chooseAccountPlan";

function RegisterForm() {
  const [user, loading, error] = useAuthState(auth);
  const { accountPlansData, isLoading, isError } = useAccountPlans();
  const [activeFormStep, setActiveFormStep] = useState<TActiveFormSteps>("userInfo");
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState<string | undefined>(undefined);
  const [currentRegisterProvider, setCurrentRegisterProvider] = useState<TRegisterProvider>(
    createAccount.currentRegisterProvider
  );

  const [userData, setUserData] = useState<TUserData>({
    username: "",
    email: "",
    password: "",
    accountPlan: EAccountPlanName.Bronze,
    accountRole: "User",
    uploadsUsed: 0,
  });

  const [selectedAccountPlanName, setSelectedAccountPlanName] = useState<TAccountPlanName>(
    userData?.accountPlan as TAccountPlanName
  );

  const [userDataError, setUserDataError] = useState<TUserDataError>({
    username: {
      message: undefined,
    },
    email: {
      message: undefined,
    },
    password: {
      message: undefined,
      containsEnoughCharacters: false,
      containsUpperCaseCharacter: false,
      containsLowerCaseCharacter: false,
      containsNumber: false,
    },
    accountPlan: {
      message: undefined,
    },
  });

  const onRegisterProviderChanged: ObserverRegisterProvider = (providerId: TRegisterProvider) => {
    setCurrentRegisterProvider(providerId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleProviderInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    createAccount.ChangeStrategy(value as TRegisterProvider);
  };

  const handleAccountPlanInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedAccountPlanName(value as TAccountPlanName);
  };

  const handleFormStepChange = () => {
    if (activeFormStep === "userInfo") {
      console.log("Step 1");
      if (createAccount.currentRegisterProvider !== "Email") {
        console.log("Step 2");
        setActiveFormStep("chooseAccountPlan");
      } else {
        console.log("Step 3");
        if (
          userDataError.username &&
          (userDataError.username.message === "" || userDataError.username.message === undefined) &&
          (userDataError.email.message === "" || userDataError.email.message === undefined) &&
          (userDataError.password.message === "" || userDataError.password.message === undefined)
        ) {
          console.log("Step 4");
          setActiveFormStep("chooseAccountPlan");
        }
      }
    } else {
      setActiveFormStep("userInfo");
    }
  };

  const validateForm = () => {
    setFirebaseErrorMessage(undefined);

    const usernameCheck = validateUsername(userData);
    const emailCheck = validateEmail(userData.email);
    const passwordCheck = validatePassword(userData.password);

    setUserDataError((prev) => {
      return {
        ...prev,
        username: {
          message: usernameCheck.message,
        },
        email: {
          message: emailCheck.message,
        },
        password: {
          message: passwordCheck.message,
          containsEnoughCharacters: passwordCheck.password.containsEnoughCharacters,
          containsUpperCaseCharacter: passwordCheck.password.containsUpperCaseCharacter,
          containsLowerCaseCharacter: passwordCheck.password.containsLowerCaseCharacter,
          containsNumber: passwordCheck.password.containsNumber,
        },
      };
    });

    return usernameCheck.isValid && emailCheck.isValid && passwordCheck.isValid;
  };

  const handleSignIn = (userData: TUserData) => {
    createAccount.CreateAccount(userData);
  };

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      accountPlan: selectedAccountPlanName,
    }));
  }, [selectedAccountPlanName]);

  useEffect(() => {
    if (!isLoading && !!userData && !!accountPlansData) {
      setSelectedAccountPlanName(
        getAccountPlanProperty(
          accountPlansData,
          userData.accountPlan as TAccountPlanName,
          "name"
        ) as TAccountPlanName
      );
    }
  }, [isLoading, userData, accountPlansData]);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      setFirebaseErrorMessage(error.message);
    });

    observableRegisterProvider.subscribe(onRegisterProviderChanged);

    return () => observableRegisterProvider.unsubscribe(onRegisterProviderChanged);
  }, []);

  return (
    <div id={styles.registerWrapper}>
      {!loading && (
        <div className={styles.register__formContainer}>
          {user && !user.isAnonymous ? (
            <LogoutFirst />
          ) : activeFormStep === "userInfo" ? (
            <UserInfo
              userData={userData}
              userDataError={userDataError}
              currentRegisterProvider={currentRegisterProvider}
              handleInputChange={handleInputChange}
              handleProviderInputChange={handleProviderInputChange}
              handleFormStepChange={handleFormStepChange}
              validateForm={validateForm}
            />
          ) : (
            <ChooseAccountPlan
              userData={userData}
              accountPlans={accountPlansData}
              selectedAccountPlanName={selectedAccountPlanName}
              handleFormStepChange={handleFormStepChange}
              handleAccountPlanInputChange={handleAccountPlanInputChange}
              handleSignIn={handleSignIn}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RegisterForm;

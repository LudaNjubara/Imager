import { useEffect, useState, ChangeEvent } from "react";
import { getRedirectResult } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  emailRegex,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  passwordRegex,
  usernameRegex,
} from "../../constants/constants";
import { TAccountPlanName, TUserData, TUserDataError, TRegisterProvider } from "../../types/globals";
import { getAccountPlanProperty } from "../../utils/register/registerUtils";
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
    accountPlan: "Bronze",
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
      if (createAccount.currentRegisterProvider !== "Email") {
        setActiveFormStep("chooseAccountPlan");
      } else {
        if (
          userDataError.username &&
          userDataError.username.message === "" &&
          userDataError.email.message === "" &&
          userDataError.password.message === ""
        ) {
          setActiveFormStep("chooseAccountPlan");
        }
      }
    } else {
      setActiveFormStep("userInfo");
    }
  };

  const validateForm = () => {
    setFirebaseErrorMessage(undefined);

    if (!userData.username) {
      setUserDataError({
        ...userDataError,
        username: {
          message: "Username is required",
        },
      });
    } else if (!usernameRegex.test(userData.username)) {
      setUserDataError({
        ...userDataError,
        username: {
          message: "Username is not valid",
        },
      });
    } else {
      setUserDataError({
        ...userDataError,
        username: {
          message: "",
        },
      });
    }

    if (userData.email.length === 0) {
      setUserDataError((prev) => {
        return { ...prev, email: { message: "Email is required" } };
      });
    } else if (!emailRegex.test(userData.email)) {
      setUserDataError((prev) => {
        return { ...prev, email: { message: "Email is not valid" } };
      });
    } else {
      setUserDataError((prev) => {
        return {
          ...prev,
          email: { message: "" },
        };
      });
    }

    if (userData.password.length === 0) {
      setUserDataError((prev) => {
        return { ...prev, password: { message: "Password is required" } };
      });
    } else if (!passwordRegex.test(userData.password)) {
      setUserDataError((prev) => {
        return {
          ...prev,
          password: {
            message: "Password is not valid",
            containsEnoughCharacters:
              userData.password.length >= MIN_PASSWORD_LENGTH &&
              userData.password.length <= MAX_PASSWORD_LENGTH,
            containsUpperCaseCharacter: !!userData.password.match(/[A-Z]/),
            containsLowerCaseCharacter: !!userData.password.match(/[a-z]/),
            containsNumber: !!userData.password.match(/[0-9]/),
          },
        };
      });
    } else {
      setUserDataError((prev) => {
        return { ...prev, password: { message: "" } };
      });
    }
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
    if (!isLoading && !!userData) {
      setSelectedAccountPlanName(
        getAccountPlanProperty(
          accountPlansData,
          userData.accountPlan as TAccountPlanName,
          "name"
        ) as TAccountPlanName
      );
    }
  }, [isLoading, userData]);

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

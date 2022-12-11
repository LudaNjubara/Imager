import RegisterProviderStrategy from './registerProviderStrategy';
import { TRegisterProvider, TUserData } from '../../types/globals';
import observableRegisterProvider from './ObservableRegisterProvider.class';

interface ICreateAccount {
    currentRegisterProvider: TRegisterProvider;
    ChangeStrategy: (newStrategy: TRegisterProvider) => void;
    CreateAccount: (userData: TUserData) => void;
}

class CreateAccount implements ICreateAccount {
    private _strategy: (userData: TUserData) => void;
    private _currentRegisterProvider: TRegisterProvider;

    constructor(providerId: TRegisterProvider = "Email") {
        this._currentRegisterProvider = providerId;
        this._strategy = RegisterProviderStrategy[providerId as keyof RegisterProviderStrategy];
    }

    get currentRegisterProvider() {
        return this._currentRegisterProvider;
    }

    ChangeStrategy(newStrategy: TRegisterProvider) {
        this._strategy = RegisterProviderStrategy[newStrategy as keyof RegisterProviderStrategy];
        this._currentRegisterProvider = newStrategy;
        observableRegisterProvider.notify(newStrategy);
    }

    CreateAccount(userData: TUserData) {
        this._strategy(userData);
    }
}

const createAccount = new CreateAccount();

export default createAccount;
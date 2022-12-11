import { TLoginProvider, TUserData } from '../../types/globals';
import LoginStrategy from './loginStrategy';

interface ILogin {
    ChangeStrategy: (newStrategy: TLoginProvider) => void;
    Login: (userData?: TUserData) => void;
}

class Login implements ILogin {
    private _strategy: (userData?: TUserData) => void;

    constructor(providerId: TLoginProvider = "Email") {
        this._strategy = LoginStrategy[providerId as keyof LoginStrategy];
    }

    ChangeStrategy(newStrategy: TLoginProvider) {
        this._strategy = LoginStrategy[newStrategy as keyof LoginStrategy];
    }

    Login(userData?: TUserData) {
        if (userData) this._strategy(userData);
        else this._strategy();
    }
}

const login = new Login();

export default login;
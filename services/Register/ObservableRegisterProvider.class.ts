import { TRegisterProvider } from "../../types/globals";

export type ObserverRegisterProvider = (providerId: TRegisterProvider) => void;

export class ObservableRegisterProvider {
    private _subscribers: ObserverRegisterProvider[] = [];

    subscribe(observer: ObserverRegisterProvider) {
        this._subscribers.push(observer);
    }

    unsubscribe(observer: ObserverRegisterProvider) {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== observer);
    }

    notify(providerId: TRegisterProvider) {
        this._subscribers.forEach(sub => sub(providerId));
    }
}

const observableRegisterProvider = new ObservableRegisterProvider();

export default observableRegisterProvider;
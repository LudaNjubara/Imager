import { TUserData } from "../../types/globals";

export type ObserverAccountItem = (clickedUser: TUserData) => void;

export class ObservableAccountItem {
    private _subscribers: ObserverAccountItem[] = [];

    subscribe(observer: ObserverAccountItem) {
        this._subscribers.push(observer);
    }

    unsubscribe(observer: ObserverAccountItem) {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== observer);
    }

    notify(clickedUser: TUserData) {
        this._subscribers.forEach(sub => sub(clickedUser));
    }
}

const observableAccountItem = new ObservableAccountItem();

export default observableAccountItem;
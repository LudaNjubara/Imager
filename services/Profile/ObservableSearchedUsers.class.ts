import { TUserData } from "../../types/globals";

export type ObserverSearchedUsers = (searchedUsers: TUserData[]) => void;

export class ObservableSearchedUsers {
    private _subscribers: ObserverSearchedUsers[] = [];

    subscribe(observer: ObserverSearchedUsers) {
        this._subscribers.push(observer);
    }

    unsubscribe(observer: ObserverSearchedUsers) {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== observer);
    }

    notify(searchedUsers: TUserData[]) {
        this._subscribers.forEach(sub => sub(searchedUsers));
    }
}

const observableSearchedUsers = new ObservableSearchedUsers();

export default observableSearchedUsers;
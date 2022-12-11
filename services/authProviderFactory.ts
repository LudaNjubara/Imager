import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { googleProvider, gitHubProvider } from "../config/firebaseConfig";
import { TFederalProvider } from "../types/globals";

export const authProviderFactory = (providerId: TFederalProvider) => {
    switch (providerId) {
        case 'Google':
            return {
                instance: googleProvider,
                class: GoogleAuthProvider
            };

        case 'GitHub':
            return {
                instance: gitHubProvider,
                class: GithubAuthProvider
            };

        default:
            throw new Error('Invalid providerId');
    }
}
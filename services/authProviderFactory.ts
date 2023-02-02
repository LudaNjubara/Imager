import { googleProvider, gitHubProvider } from "../config/firebaseConfig";
import { TFederalProvider } from "../types/globals";

export const authProviderFactory = (providerId: TFederalProvider) => {
    switch (providerId) {
        case 'Google':
            return googleProvider

        case 'GitHub':
            return gitHubProvider

        default:
            throw new Error('Invalid providerId');
    }
}
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { googleProvider, gitHubProvider } from "../config/firebaseConfig";

export const authProviderFactory = (authProvider: string | undefined) => {
    switch (authProvider?.toLowerCase()) {
        case 'google':
            return {
                instance: googleProvider,
                class: GoogleAuthProvider
            };

        case 'github':
            return {
                instance: gitHubProvider,
                class: GithubAuthProvider
            };

        default:
            return {
                instance: googleProvider,
                class: GoogleAuthProvider
            };
    }
}
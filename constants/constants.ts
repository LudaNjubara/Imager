import { Poppins } from "next/font/google"

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    fallback: ["system-ui", "arial"],
});

const toDateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
} as const;

const loginAndRegister__messageVariants = {
    hidden: {
        opacity: 0,
        y: -5,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -5,
    },
};

const imageUpload__modalVariants = {
    hidden: {
        opacity: 0,
        y: -5,
        scale: 0.6
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1
    },

    exit: {
        opacity: 0,
        y: -5,
        scale: 0.6
    }
}

const choosePlanVariants = {
    hidden: {
        opacity: 0,
        scale: 0.85
    },
    visible: {
        opacity: 1,
        scale: 1
    },
}

const emailRegex = /[a-z0-9][a-z0-9_.]+@[a-z0-9_]+\.(com|[a-z]{2})$/;
// password regex
// at least 6 characters
// at least one uppercase letter
// at least one lowercase letter
// at least one number
// at least one special character
// no spaces
// max 16 characters
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 15;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,16}$/;
// username regex
// at least 3 characters
// max 16 characters
// no special characters
const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;

export { poppins, toDateOptions, loginAndRegister__messageVariants, imageUpload__modalVariants, choosePlanVariants, emailRegex, passwordRegex, usernameRegex, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH };
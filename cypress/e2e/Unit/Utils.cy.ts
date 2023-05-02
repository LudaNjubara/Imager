
const emailRegex = /[a-z0-9][a-z0-9_.]+@[a-z0-9_]+\.(com|[a-z]{2})$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,16}$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 15;

const getNextDayInMilliseconds = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    return nextDay.getTime();
}

const validateEmail = (emailToValidate: string) => {
    let message = ""
    let isValid = false

    if (emailToValidate.length === 0) {
        message = "Email is required"
    } else if (!emailRegex.test(emailToValidate)) {
        message = "Email is not valid"
    } else {
        isValid = true
    }

    return {
        message,
        isValid
    }
};

const validatePassword = (passwordToValidate: string) => {
    let message = ""
    let isValid = false
    let password: {
        message: string,
        containsEnoughCharacters: boolean,
        containsUpperCaseCharacter: boolean,
        containsLowerCaseCharacter: boolean,
        containsNumber: boolean,
    } = {
        message: message,
        containsEnoughCharacters: false,
        containsUpperCaseCharacter: false,
        containsLowerCaseCharacter: false,
        containsNumber: false,
    }

    if (passwordToValidate.length === 0) {
        message = "Password is required"
    } else if (!passwordRegex.test(passwordToValidate)) {
        message = "Password is not valid"
        password = {
            message: message,
            containsEnoughCharacters:
                passwordToValidate.length >= MIN_PASSWORD_LENGTH &&
                passwordToValidate.length <= MAX_PASSWORD_LENGTH,
            containsUpperCaseCharacter: !!passwordToValidate.match(/[A-Z]/),
            containsLowerCaseCharacter: !!passwordToValidate.match(/[a-z]/),
            containsNumber: !!passwordToValidate.match(/[0-9]/),
        }
    } else {
        isValid = true
    }

    return {
        message,
        isValid,
        password
    }
};

describe('getNextDayInMilliseconds', () => {
    it('returns the timestamp of the next day at midnight', () => {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const expectedTimestamp = tomorrow.setHours(0, 0, 0, 0);

        const actualTimestamp = getNextDayInMilliseconds();

        expect(actualTimestamp).to.equal(expectedTimestamp);
    });
});

describe('validateEmail', () => {
    const validEmail = 'test@example.com'; // valid email
    const invalidEmail1 = ''; // empty string
    const invalidEmail2 = 'test@example'; // no top level domain
    const invalidEmail3 = 'test@.com'; // no domain name
    const invalidEmail4 = 'test@exa mple.com'; // uses invalid space
    const invalidEmail5 = 'test@example.com!' // uses invalid special character
    const invalidEmail6 = 'Test@Example.com'; // uses uppercase letters

    it('returns valid for a valid email', () => {
        const result = validateEmail(validEmail);
        expect(result.isValid).to.be.true;
    });

    it('returns invalid and error message for an empty email string', () => {
        const result = validateEmail(invalidEmail1);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is required');
    });

    it('returns invalid and error message for an email without a top-level domain', () => {
        const result = validateEmail(invalidEmail2);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is not valid');
    });

    it('returns invalid and error message for an email without a domain name', () => {
        const result = validateEmail(invalidEmail3);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is not valid');
    });

    it('returns invalid and error message for an email with invalid space', () => {
        const result = validateEmail(invalidEmail4);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is not valid');
    });

    it('returns invalid and error message for an email with invalid special character', () => {
        const result = validateEmail(invalidEmail5);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is not valid');
    });

    it('returns invalid and error message for an email with uppercase letters', () => {
        const result = validateEmail(invalidEmail6);
        expect(result.isValid).to.be.false;
        expect(result.message).to.equal('Email is not valid');
    });
});

describe('validatePassword', () => {
    const validPassword = 'Val1$Pa55w.rd';
    const invalidPassword1 = ''; // empty string
    const invalidPassword2 = 'Val1$'; // too short
    const invalidPassword3 = 'Vali$Passw.rd'; // doesn't contain numbers
    const invalidPassword4 = 'VAL1$PA55W.RD'; // doesn't contain lowercase letters
    const invalidPassword5 = 'val1$pa55w.rd'; // doesn't contain uppercase letters
    const invalidPassword6 = 'Val1$Pa55w.rdVal1$Pa55w.rd'; // too long

    it('returns a message and isValid=true for a valid password', () => {
        const result = validatePassword(validPassword);
        expect(result.message).to.equal('');
        expect(result.isValid).to.be.true;
    });

    it('returns a message and isValid=false for an empty password', () => {
        const result = validatePassword(invalidPassword1);
        expect(result.message).to.equal('Password is required');
        expect(result.isValid).to.be.false;
    });

    it('returns a message and isValid=false for a password that is too short', () => {
        const result = validatePassword(invalidPassword2);
        expect(result.message).to.equal('Password is not valid');
        expect(result.isValid).to.be.false;
        expect(result.password.containsEnoughCharacters).to.be.false;
    });

    it('returns a message and isValid=false for a password that does not contain numbers', () => {
        const result = validatePassword(invalidPassword3);
        expect(result.message).to.equal('Password is not valid');
        expect(result.isValid).to.be.false;
        expect(result.password.containsNumber).to.be.false;
    });

    it('returns a message and isValid=false for a password that does not contain lowercase letters', () => {
        const result = validatePassword(invalidPassword4);
        expect(result.message).to.equal('Password is not valid');
        expect(result.isValid).to.be.false;
        expect(result.password.containsLowerCaseCharacter).to.be.false;
    });

    it('returns a message and isValid=false for a password that does not contain uppercase letters', () => {
        const result = validatePassword(invalidPassword5);
        expect(result.message).to.equal('Password is not valid');
        expect(result.isValid).to.be.false;
        expect(result.password.containsUpperCaseCharacter).to.be.false;
    });

    it('returns a message and isValid=false for a password that is too long', () => {
        const result = validatePassword(invalidPassword6);
        expect(result.message).to.equal('Password is not valid');
        expect(result.isValid).to.be.false;
        expect(result.password.containsEnoughCharacters).to.be.false;
    });
});

export { }
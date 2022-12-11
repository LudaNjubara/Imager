//import { TUserInfo } from "../../../Globals";
type TLogOptions = {
    readonly object?: any;
}

const logOptionsDefaults: TLogOptions = {
    object: undefined
}

const setDefaultOptions = (options: TLogOptions, defaults: {}) => {
    return Object.assign({}, defaults, options);
}

type TLogType = "log" | "warn" | "error";

interface ILogger {
    Log(message: string, type: TLogType, options?: TLogOptions): void;
}

class Logger implements ILogger {

    Log(message: string, type: TLogType = "log", options?: TLogOptions) {
        if (options) options = setDefaultOptions(options, logOptionsDefaults);

        switch (type) {
            case "log":
                if (options?.object) console.log(message, options.object)
                else console.log(message)
                break;
            case "warn":
                if (options?.object) console.warn(message, options.object)
                else console.warn(message)
                break;
            case "error":
                if (options?.object) console.error(message, options.object)
                else console.error(message)
                break;
            default:
                throw new Error("Invalid log type");
        }
    }
}

const logger = Object.freeze(new Logger());

export default logger;
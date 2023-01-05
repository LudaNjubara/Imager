import { TImageInfo } from "../../types/globals";

const detectOS = () => {
    const userAgent = navigator.userAgent;
    const isWindows = /Windows/.test(userAgent);
    const isMac = /Mac/.test(userAgent);
    const isLinux = /Linux/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isiOS = /iPhone|iPad|iPod/.test(userAgent);

    if (isWindows) return "Windows";
    if (isMac) return "Mac";
    if (isLinux) return "Linux";
    if (isAndroid) return "Android";
    if (isiOS) return "iOS";

    return "Unknown";
}

const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent);
    const isOpera = /Opera/.test(userAgent);
    const isIE = /Trident/.test(userAgent);

    if (isChrome) return "Chrome";
    if (isFirefox) return "Firefox";
    if (isSafari) return "Safari";
    if (isOpera) return "Opera";
    if (isIE) return "IE";

    return "Unknown";
}

const getUserLocation = ():
    Promise<{ latitude: number, longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation is not supported by your browser");
        }

        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, () => {
            reject("Unable to retrieve your location");
        });
    });
}

const setCSSVariable = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
}

const generateRandomId = (numOfCharacters: number = 25) => {
    // generate random string for id
    const randomString = [...Array(numOfCharacters)].map(() => Math.random().toString(36)[2]).join('');
    const id = randomString;

    return id;
};

const extractImageKeyFromURL = (url: string) => {
    const regex = /(?<=imager-project-bucket.s3.eu-central-1.amazonaws.com\/)(.*)(?=\?)/g;
    const match = regex.exec(url);

    if (!match) throw new Error(`No match found in ${url}`);

    const imageKey = match[0];

    return imageKey;
}

const extractImageDataFromURL = (url: string, imagesData: TImageInfo[]) => {
    const imageKey = extractImageKeyFromURL(url);
    const imageInfo = imagesData.find(item => item.key === imageKey);

    if (!imageInfo) throw new Error(`No image found in ${imagesData} with key ${imageKey}`);

    return imageInfo;
}

const convertFileToImage = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                resolve(img) as any;
            };
            img.onerror = (error) => {
                reject(error);
            };
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
}

const convertImageKeysToString = (array: TImageInfo[]) => {
    if (!array || !array.length) return;

    const imageKeys = array.map(item => item.key).join(",")

    return imageKeys
}

const downloadImage = (imageURL: string, imageKey: string) => {
    const link = document.createElement("a");
    link.href = imageURL;
    link.setAttribute("download", imageKey);
    link.setAttribute("href", "");
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
}

const convertDatabaseFieldToReadableFormat = (fieldName: string) => {
    const titleArray = fieldName.split("");
    const newFieldNameArray = titleArray.map((char) => {
        if (char === char.toUpperCase()) {
            return ` ${char.toLowerCase()}`;
        } else {
            return char;
        }
    });

    return newFieldNameArray.join("");
}

export { detectOS, detectBrowser, getUserLocation, generateRandomId, setCSSVariable, extractImageDataFromURL, convertFileToImage, convertImageKeysToString, downloadImage, convertDatabaseFieldToReadableFormat };
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { emailRegex, usernameRegex } from '../../constants/constants';
import { TAllowedImageExtensions, TEditedImageExtensions, TImageInfo, TUserData } from "../../types/globals";

const detectOS = () => {
    const userAgent = navigator.userAgent;

    if (/Windows/.test(userAgent)) return "Windows";
    if (/Mac/.test(userAgent)) return "Mac";
    if (/Linux/.test(userAgent)) return "Linux";
    if (/Android/.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";

    return "Unknown";
}

const detectBrowser = () => {
    const userAgent = navigator.userAgent;

    // Create an object with the names of the browsers and the regex that will match the user agent
    const browsers = {
        Chrome: /Chrome/,
        Firefox: /Firefox/,
        Safari: /Safari/,
        Opera: /Opera/,
        IE: /Trident/,
    };

    // Loop through the object and check if the regex matches the user agent
    for (const [name, regex] of Object.entries(browsers)) {
        if (regex.test(userAgent)) return name;
    }

    // If we didn't find any matches, return "Unknown"
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

const validateUsername = (userData: TUserData) => {
    let message = ""
    let isValid = false

    if (!userData.username) {
        message = "Username is required"
    } else if (!usernameRegex.test(userData.username)) {
        message = "Username is not valid"
    } else {
        isValid = true
    }

    return {
        message,
        isValid
    }
};

const validateEmail = (userData: TUserData) => {
    let message = ""
    let isValid = false

    if (userData.email.length === 0) {
        message = "Email is required"
    } else if (!emailRegex.test(userData.email)) {
        message = "Email is not valid"
    } else {
        isValid = true
    }

    return {
        message,
        isValid
    }
};

const getNextDayInMilliseconds = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    return nextDay.getTime();
}

const setCSSVariable = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
}

const generateRandomId = (numOfCharacters: number = 25) => {
    if (numOfCharacters < 1) {
        throw new Error('numOfCharacters must be a positive number');
    }
    if (!Number.isInteger(numOfCharacters)) {
        throw new Error('numOfCharacters must be an integer');
    }
    if (numOfCharacters < 25) {
        throw new Error('numOfCharacters must be at least 25');
    }

    // generate random string for id
    const randomId = [...Array(numOfCharacters)].map(() => Math.random().toString(36)[2]).join('');

    return randomId;
};

const extractImageKeyFromURL = (url: string) => {
    // Find the image key in the URL
    const regex = /(?<=imager-project-bucket.s3.eu-central-1.amazonaws.com\/)(.*)(?=\?)/g;
    const match = regex.exec(url);

    // If no match is found, throw an error
    if (!match) throw new Error(`No match found in ${url}`);

    // Extract the image key from the match
    const imageKey = match[0];

    return imageKey;
}

const extractImageDataFromURL = (url: string, imagesData: TImageInfo[]): TImageInfo => {
    const imageKey = extractImageKeyFromURL(url);

    // Find the image info in the images data array
    const imageInfo = imagesData.find(item => item.key === imageKey);

    // Throw an error if the image info was not found
    if (!imageInfo) throw new Error(`No image found in ${imagesData} with key ${imageKey}`);

    return imageInfo;
}



const convertImageKeysToString = (images: TImageInfo[] | undefined) => {
    // Map over the array of images and return concatenated image keys
    return images?.map(image => image.key).join(",");
}

const downloadImage = (imageURL: string, imageKey: string) => {
    const link = document.createElement('a');

    link.setAttribute('href', imageURL);
    link.setAttribute('download', imageKey);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const getEditedImage = (ref: HTMLDivElement, extension: TEditedImageExtensions): Promise<string> => {
    return new Promise((resolve, reject) => {

        // 1. Check what image format the user selected
        switch (extension) {

            // 2. If PNG, convert the image to PNG
            case 'png':
                toPng(ref)
                    .then((dataUrl) => {
                        resolve(dataUrl)
                    })
                    .catch((error) => {
                        reject(error)
                    })
                break;

            // 3. If JPG, convert the image to JPG
            case 'jpg':
                toJpeg(ref)
                    .then((dataUrl) => {
                        resolve(dataUrl)
                    })
                    .catch((error) => {
                        reject(error)
                    })
                break;

            // 4. If SVG, convert the image to SVG
            case 'svg':
                toSvg(ref)
                    .then((dataUrl) => {
                        resolve(dataUrl)
                    })
                    .catch((error) => {
                        reject(error)
                    })
                break;

            // 5. If the image format is not PNG, JPG or SVG, reject the promise
            default:
                reject('Unsupported image format')
                break;
        }
    })
}

const urltoFile = (url: string, filename: string, extension: TAllowedImageExtensions) => {
    return (fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], filename, { type: extension }))
    );
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const { result } = reader;
            if (typeof result === 'string') {
                resolve(result);
            } else {
                reject(new Error('Could not read file'));
            }
        };
        reader.onerror = error => reject(error);
    });
}

const base64ToImage = (base64Image: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Image

        img.onload = () => {
            resolve(img);
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

/* const blobToBase64 = (blob: Blob): Promise<string> => {
    // Create a new promise that will resolve with the base64 string
    return new Promise((resolve, reject) => {
        // Create a new file reader
        const reader = new FileReader();
        // Set the onloadend handler to convert the file to base64
        reader.onloadend = () => {
            // The result is a string if the conversion was successful
            const base64data = reader.result;
            if (typeof base64data === 'string') {
                // Resolve the promise with the base64 string
                resolve(base64data);
            } else {
                // Reject the promise with an error
                reject(new Error('Could not convert Blob to base64'));
            }
        };
        // Set the onerror handler to reject the promise with the error
        reader.onerror = (error) => {
            reject(error);
        };
        // Start reading the blob as a data URL, which will trigger the onloadend handler
        reader.readAsDataURL(blob);
    });
} */

const convertDatabaseFieldToReadableFormat = (fieldName: string) => {
    const newFieldNameArray = fieldName.split("").map((char) => {
        if (char === char.toUpperCase()) {
            return ` ${char.toLowerCase()}`;
        } else {
            return char;
        }
    });

    return newFieldNameArray.join("");
}

export { detectOS, detectBrowser, getUserLocation, validateEmail, validateUsername, getNextDayInMilliseconds, generateRandomId, setCSSVariable, extractImageDataFromURL, base64ToImage, convertImageKeysToString, downloadImage, getEditedImage, urltoFile, fileToBase64, convertDatabaseFieldToReadableFormat };
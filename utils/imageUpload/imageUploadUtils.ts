import { TImageUploadAttributes } from "../../pages/api/imageupload";
import { TAllowedImageExtensions } from "../../types/globals";
import { urltoFile } from "../common/utils";

type TAWSResponse = {
    imageKey: string,
}

const generateRandomImageKey = (extension: TAllowedImageExtensions, numOfCharacters: number = 25) => {
    // generate random string for image key thats 10 characters long and icludes only letters
    const randomString = [...Array(numOfCharacters)].map(() => Math.random().toString(36)[2]).join('');
    const imageKey = `imager_${randomString}.${extension}`;

    return imageKey;
};

const uploadImageToAWS = (base64Image: string, extension: TAllowedImageExtensions): Promise<TAWSResponse> => {
    return new Promise(async (resolve, reject) => {
        if (!base64Image) reject("No image to upload");

        try {
            // Call the API endpoint to get the url to upload to and the image key
            const { url, key: imageKey } = await getUploadURLAndKey(extension);

            const convertedImage = await urltoFile(base64Image, imageKey, extension);

            // Upload the image to AWS
            try {
                const res = await uploadImageToS3(url, extension, convertedImage);
                if (res.ok) {
                    console.log("Uploaded image successfully!");
                    resolve({ imageKey });
                } else {
                    reject(res.statusText);
                }
            }
            catch (error) {
                console.error("Error uploading image: ", error);
            }
        }
        catch (error) {
            console.error("Error getting image upload url: ", error);
        }
    });
};


const getUploadURLAndKey = (extension: TAllowedImageExtensions): Promise<TImageUploadAttributes> => {
    // Call the API endpoint we created to get the url and key to upload to
    return new Promise((resolve, reject) => {
        fetch(`/api/imageupload?extension=${encodeURI(extension)}`, {
            method: "GET",
        })
            .then(res => {
                if (res.ok) resolve(res.json())
                else reject(res.statusText)
            })
            .catch(error => {
                reject(error);
            });
    });
}

const uploadImageToS3 = (url: string, extension: TAllowedImageExtensions, image: File): Promise<Response> => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": `image/${extension}`,
                "Content-Disposition": "attachment"
            },
            body: image,
        })
            .then(res => {
                if (res.ok) resolve(res)
                else reject(res.statusText);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export { uploadImageToAWS, generateRandomImageKey }
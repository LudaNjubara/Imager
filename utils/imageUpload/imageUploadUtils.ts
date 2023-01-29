import { TImageUploadAttributes } from "../../pages/api/imageupload";
import { convertBase64ToImage, urltoFile } from "../common/utils";

type TAWSResponse = {
    imageKey: string,
}

const generateRandomImageKey = (imageExtension: string, numOfCharacters: number = 25) => {
    // generate random string for image key thats 10 characters long and icludes only letters
    const randomString = [...Array(numOfCharacters)].map(() => Math.random().toString(36)[2]).join('');
    const imageKey = `imager_${randomString}.${imageExtension}`;

    return imageKey;
};

const uploadImageToAWS = (base64Image: string, fileType: string): Promise<TAWSResponse> => {
    return new Promise(async (resolve, reject) => {
        if (!base64Image) reject("No image to upload");

        try {
            // Call the API endpoint to get the url to upload to and the image key
            const { url, key: imageKey } = await getUploadURLAndKey(fileType);

            const convertedImage = await urltoFile(base64Image, imageKey, fileType);

            // Upload the image to AWS
            try {
                const res = await uploadImageToS3(url, fileType, convertedImage);
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


const getUploadURLAndKey = (fileType: string): Promise<TImageUploadAttributes> => {
    // Call the API endpoint we created to get the url and key to upload to
    return new Promise((resolve, reject) => {
        fetch(`/api/imageupload?fileType=${encodeURI(fileType)}`, {
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

const uploadImageToS3 = (url: string, fileType: string, image: File): Promise<Response> => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": `image/${fileType}`,
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
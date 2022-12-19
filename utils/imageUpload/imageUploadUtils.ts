import { randomBytes } from 'crypto';

type TAWSResponse = {
    imageKey: string | null,
}

export const generateRandomImageKey = (imageExtension: string, bytes: number = 32) => {
    const randomString = randomBytes(bytes).toString('hex');
    const imageKey = `${randomString}.${imageExtension}`;

    return imageKey;
};

export const uploadImageToAWS = async (image: File): Promise<TAWSResponse> => {
    let imageKey = null;

    if (image) {
        const fileType = image.type.replace(/%2F/g, "/").split("/")[1];

        const res = await fetch(`/api/imageupload?fileType=${fileType}`, {
            method: "GET",
        });
        const { url, key } = await res.json();

        const upload = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": `image/${fileType}`
            },
            body: image,
        })
            .then((res) => {
                console.log("Uploaded image successfully!");
                imageKey = key

            })
            .catch((err) => {
                console.log("Error uploading image: ", err);
            });
    }

    return { imageKey };
};
import { randomBytes } from 'crypto';

export const generateRandomImageName = (bytes: number = 32) => randomBytes(bytes).toString('hex');

export const uploadImageToAWS = async (image: File) => {

    if (image) {
        const fileType = encodeURIComponent(image.type);

        const res = await fetch(`/api/imageupload?fileType=${fileType}`);
        const { url } = await res.json();

        const formData = new FormData();
        formData.append("image", image);

        const upload = await fetch(url, {
            method: "PUT",
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    console.log("Uploaded successfully!");
                } else {
                    console.error("Upload failed.");
                }
            })
            .catch((err) => console.log(err));
    }
};
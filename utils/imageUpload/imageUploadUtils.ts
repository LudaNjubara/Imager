import { randomBytes } from 'crypto';
import { db } from "../../config/firebaseConfig"
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { TImageInfo } from '../../types/globals';

type TAWSResponse = {
    imageKey: string | null,
}

export const generateRandomImageName = (bytes: number = 32) => randomBytes(bytes).toString('hex');

export const uploadImageToAWS = async (image: File): Promise<TAWSResponse> => {
    let imageKey = null;

    if (image) {
        const fileType = encodeURIComponent(image.type);

        const res = await fetch(`/api/imageupload?fileType=${fileType}`);
        const { url, key } = await res.json();

        const formData = new FormData();
        formData.append("image", image);

        const upload = await fetch(url, {
            method: "PUT",
            body: formData,
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

export const uploadImageInfoToDatabase = (imageInfo: TImageInfo) => {

    const docRef = doc(db, `images/${imageInfo.key}`);
    setDoc(docRef, imageInfo).then(() => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}
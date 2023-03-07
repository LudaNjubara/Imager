import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { TImageInfo } from "../../types/globals";

export interface IImagesDatabase {
    UpdateImageInfo: (description: string, hashtags: string[], key: string) => void;
    AddImageInfo: (imageInfo: TImageInfo) => void;
}

export class ImagesDatabase implements IImagesDatabase {
    UpdateImageInfo(description: string, hashtags: string[], key: string) {
        const docRef = doc(db, `images/${key}`);

        updateDoc(docRef, {
            description,
            hashtags
        })
            .catch((error) => {
                throw new Error(error);
            });
    }

    AddImageInfo(imageInfo: TImageInfo) {
        const docRef = doc(db, `images/${imageInfo.key}`);

        setDoc(docRef, imageInfo)
            .catch((error) => {
                throw new Error(error);
            });
    }
}
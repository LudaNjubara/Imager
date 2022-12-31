import React from "react";
import { TImageInfo } from "../../types/globals";

const setCSSVariable = (name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
}

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

const convertDatabaseFiledToReadableFormat = (fieldName: string) => {
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

export { setCSSVariable, extractImageDataFromURL, convertFileToImage, convertImageKeysToString, convertDatabaseFiledToReadableFormat };
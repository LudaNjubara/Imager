type TAWSResponse = {
    imageKey: string | null,
}

export const generateRandomImageKey = (imageExtension: string, numOfCharacters: number = 25) => {
    // generate random string for image key thats 10 characters long and icludes only letters
    const randomString = [...Array(numOfCharacters)].map(() => Math.random().toString(36)[2]).join('');
    const imageKey = `imager_${randomString}.${imageExtension}`;

    return imageKey;
};

export const uploadImageToAWS = async (base64Image: string, fileType: string): Promise<TAWSResponse> => {
    let imageKey = null;

    if (base64Image) {
        const res = await fetch(`/api/imageupload?fileType=${fileType}`, {
            method: "GET",
        });
        const { url, key } = await res.json();

        const base64Data = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const upload = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": `image/${fileType}`,
                "Content-Encoding": "base64"
            },
            body: base64Data,
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
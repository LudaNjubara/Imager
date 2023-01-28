// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";


import s3 from '../../config/s3Config';

type TData = {
    signedURLs: string[];
}

type TErrorData = {
    body: string;
}

const expiresInSeconds = 7200; // 2 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse<TData | TErrorData>) {
    // Check that the request method is GET.
    if (req.method !== 'GET') {
        res.status(405).json({ body: 'Method not allowed' });
        return
    }

    // Declare the array of signed URLs.
    const signedURLs: string[] = [];

    // Check that the request query contains image keys.
    const { imageKeys } = req.query as { imageKeys: string };

    if (!imageKeys) {
        res.status(400).json({ body: 'Bad request' });
        return
    }

    // Split the image keys into an array.
    const imageKeysArray = imageKeys.split(',');

    // Loop through the image keys and get the signed URLs.
    for (const key of imageKeysArray) {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key as string,
        }

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds })
            .catch((error) => {
                res.status(500).json({ body: error });
                return;
            });
        if (url) signedURLs.push(url);
    }

    // Check that the signed URLs are not empty.
    if (signedURLs) {
        res.status(200).json(signedURLs as unknown as TData)
        return
    };

    res.status(500).json({ body: 'Internal server error' });
}

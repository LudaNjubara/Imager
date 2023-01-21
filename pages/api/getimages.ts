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

    if (req.method !== 'GET') {
        res.status(405).json({ body: 'Method not allowed' });
        return
    }
    const signedURLs: string[] = [];
    const { imageKeys } = req.query as { imageKeys: string };

    if (!imageKeys) {
        res.status(400).json({ body: 'Bad request' });
        return
    }

    const imageKeysArray = imageKeys.split(',');

    for (const key of imageKeysArray) {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key as string,
        }

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds })
            .catch((err) => {
                res.status(500).json({ body: err });
                return;
            });
        if (url) signedURLs.push(url);
    }

    if (signedURLs) {
        res.status(200).json(signedURLs as unknown as TData)
        return
    };

    res.status(500).json({ body: 'Internal server error' });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import s3 from '../../config/s3Config';
import { generateRandomImageKey } from '../../utils/imageUpload/imageUploadUtils';

export type TImageUploadAttributes = {
    url: string;
    key: string;
}

export type TErrorData = {
    body: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TImageUploadAttributes | TErrorData>) {
    if (req.method !== 'GET') {
        res.status(405).json({ body: 'Method not allowed' });
        return
    }

    // Extract the file type from the query string
    const { fileType } = req.query as { fileType: string };

    // If no file type was provided, return a 400 response
    if (!fileType) {
        res.status(400).json({ body: 'Missing file type' });
        return
    }

    // Generate a random file name for the image
    const randomImageKey = generateRandomImageKey(fileType);

    // Define the parameters for the S3 PutObject command
    const putObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: randomImageKey,
    }

    // Create the PutObject command
    const command = new PutObjectCommand(putObjectParams);

    // Generate a signed URL for the PutObject command
    const url = await getSignedUrl(s3, command, { expiresIn: 60 })
        .catch((error) => {
            res.status(500).json({ body: error });
            return;
        });

    // If the signed URL was created successfully, return it in the response
    if (url) res.status(200).json({ url, key: randomImageKey });
}

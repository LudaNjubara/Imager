// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import aws from 'aws-sdk';
import { generateRandomImageName } from '../../utils/imageUpload/imageUploadUtils';

type TData = {
    url: string;
    key: string;
}

type TErrorData = {
    body: string;
}

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    region: process.env.S3_REGION,
    signatureVersion: 'v4',
});


export default async function handler(req: NextApiRequest, res: NextApiResponse<TData | TErrorData>) {

    if (req.method !== 'GET') {
        res.status(405).json({ body: 'Method not allowed' });
    }

    const randomImageName = generateRandomImageName();

    s3.getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: randomImageName,
        Expires: 60,
        ContentType: req.query.fileType,
    }, (err, url) => {
        if (err) {
            res.status(500).json({ body: 'Error creating a signed URL' });
            return
        }
        res.status(200).json({ url, key: randomImageName });
    })
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import aws from 'aws-sdk';
import { generateRandomImageName } from '../../utils/imageUpload/imageUploadUtils';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    region: process.env.S3_REGION,
    signatureVersion: 'v4',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(500).json({ error: 'Method not allowed' });
    }

    s3.getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: generateRandomImageName(),
        Expires: 60,
        ContentType: req.query.fileType,
    }, (err, url) => {
        if (err) {
            res.status(500).json({ error: 'Error creating a signed URL' });
        }
        res.status(200).json({ url });
    })
}

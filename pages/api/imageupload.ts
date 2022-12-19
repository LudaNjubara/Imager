// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import s3 from '../../config/s3Config';
import { generateRandomImageKey } from '../../utils/imageUpload/imageUploadUtils';

type TData = {
    url: string;
    key: string;
}

type TErrorData = {
    body: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TData | TErrorData>) {

    if (req.method !== 'GET') {
        res.status(405).json({ body: 'Method not allowed' });
        return
    }

    const { fileType } = req.query as { fileType: string };

    if (!fileType) {
        res.status(400).json({ body: 'Missing file type' });
        return
    }

    const randomImageKey = generateRandomImageKey(fileType);
    const putObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: randomImageKey,
    }
    const command = new PutObjectCommand(putObjectParams);

    const url = await getSignedUrl(s3, command, { expiresIn: 60 })
        .catch((err) => {
            res.status(500).json({ body: err });
            return;
        });

    if (url) res.status(200).json({ url, key: randomImageKey });



    /*   s3.getSignedUrl('putObject', , (err, url) => {
          if (err) {
              res.status(500).json({ body: 'Error creating a signed URL' });
              return
          }
          res.status(200).json({ url, key: randomImageName });
      }) */
}

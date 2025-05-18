import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { NextApiRequest, NextApiResponse } from "next";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";

interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

interface PresignedPostRequestBody {
  fileName: string;
  fileType: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    } as S3Credentials,
  } as S3ClientConfig);

  const { fileName, fileType } = req.body as PresignedPostRequestBody;

  const post: PresignedPost = await createPresignedPost(s3, {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Fields: {
      "Content-Type": fileType,
    },
    Expires: 120,
    Conditions: [["content-length-range", 0, 5 * 1024 * 1024]], // Limit file size to 1MB
  });

  res.status(200).json(post);
}
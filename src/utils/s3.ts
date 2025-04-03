import aws from "aws-sdk";
import crypto, { randomBytes } from "crypto";
import { promisify } from "util";

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "4",
});

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 180,
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  return uploadUrl;
}

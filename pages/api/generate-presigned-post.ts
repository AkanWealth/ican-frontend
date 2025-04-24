import { NextApiRequest, NextApiResponse } from "next";
import { generatePresignedPost } from "../../utils/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bucketName, key } = req.body;

  if (!bucketName || !key) {
    return res.status(400).json({ error: "Missing bucketName or key" });
  }

  try {
    const presignedPost = await generatePresignedPost(bucketName, key);
    res.status(200).json(presignedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate presigned post URL" });
  }
}

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { NextRequest, NextResponse } from "next/server";
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

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Get the request body
    const body = await request.json() as PresignedPostRequestBody;
    const { fileName, fileType } = body;
    
    // Validate request data
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields: fileName and fileType" },
        { status: 400 }
      );
    }
    
    // Initialize S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      } as S3Credentials,
    } as S3ClientConfig);

    // Generate presigned post
    const post: PresignedPost = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 120, // 2 minutes
      Conditions: [["content-length-range", 0, 5 * 1024 * 1024]], // Limit file size to 5MB
    });

    // Return the presigned post data
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}
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

// Add this function to handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust this to your specific domain in production
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
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
      const errorResponse = NextResponse.json(
        { error: "Missing required fields: fileName and fileType" },
        { status: 400 }
      );
      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      return errorResponse;
    }
    
    // Validate environment variables
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || 
        !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
      console.error("Missing required environment variables");
      const errorResponse = NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      return errorResponse;
    }
    
    // Initialize S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } as S3Credentials,
    } as S3ClientConfig);

    // Generate presigned post
    const post: PresignedPost = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 120, // 2 minutes
      Conditions: [["content-length-range", 0, 5 * 1024 * 1024]], // Limit file size to 5MB
    });

    // Create response with CORS headers
    const response = NextResponse.json(post);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to create upload URL", details: (error as Error).message },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}
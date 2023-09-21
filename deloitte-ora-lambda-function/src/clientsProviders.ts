import { S3Client } from "@aws-sdk/client-s3";

export const awsS3Client = new S3Client({ region: process.env.AWS_REGION });

export const cubbitS3Client = new S3Client({
  endpoint: process.env.CUBBIT_END_POINT_URL,
  credentials: {
    accessKeyId: process.env.CUBBIT_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CUBBIT_SECRET_ACCESS_KEY || "",
  },
  region: process.env.CUBBIT_REGION,
});

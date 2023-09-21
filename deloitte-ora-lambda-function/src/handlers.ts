import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

import { getErrorResult, getObjectBucketResponse, getSuccessResult, sendObjectBucketResponse } from "./utils";
import { awsS3Client, cubbitS3Client } from "./clientsProviders";
import { AwsServiceError } from "./errors";
import { HttpStatus } from "./httpStatus";
import { StatusCode } from "./statusCodes";

export const getBackupsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const client = event.pathParameters!["client"];
    if (!client || client.length === 0) {
      return {
        statusCode: StatusCode.BAD_REQUEST,
        body: JSON.stringify({ message: HttpStatus.MISSING_KEYS }),
      };
    }

    const allKeys: (string | undefined)[] = [];
    const awsCommand = new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME });
    const cubbitCommand = new ListObjectsV2Command({ Bucket: process.env.CUBBIT_BUCKET_NAME });
    const { Contents } =
      client === "aws" ? await awsS3Client.send(awsCommand) : await cubbitS3Client.send(cubbitCommand);

    Contents?.forEach((content) => allKeys.push(content.Key));

    return getSuccessResult(JSON.stringify(allKeys) || JSON.stringify([]), HttpStatus.GET);
  } catch (S3ServiceException) {
    return getErrorResult(
      new AwsServiceError(HttpStatus.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, HttpStatus.GET),
    );
  }
};

export const postBackupsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let body = JSON.parse(event.body || "{}");
  let client = event.pathParameters!["client"];
  let keys = body.keys;

  if ((!keys || keys.length === 0) && (!client || client.length === 0)) {
    return getErrorResult(new AwsServiceError(HttpStatus.MISSING_KEYS, StatusCode.BAD_REQUEST, HttpStatus.POST));
  }

  let getObjectBucket, getObjectBucketClient, sendObjectBucket, sendObjectBucketClient;

  if (client === "aws") {
    getObjectBucket = process.env.AWS_BUCKET_NAME;
    getObjectBucketClient = awsS3Client;
    sendObjectBucket = process.env.CUBBIT_BUCKET_NAME;
    sendObjectBucketClient = cubbitS3Client;
  } else {
    getObjectBucket = process.env.CUBBIT_BUCKET_NAME;
    getObjectBucketClient = cubbitS3Client;
    sendObjectBucket = process.env.AWS_BUCKET_NAME;
    sendObjectBucketClient = awsS3Client;
  }

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let responseStringBody = await getObjectBucketResponse(getObjectBucket, getObjectBucketClient, key);
    await sendObjectBucketResponse(sendObjectBucket, sendObjectBucketClient, key, responseStringBody);
  }

  return getSuccessResult(JSON.stringify(HttpStatus.CUBBIT_SERVER_SUCCESS), HttpStatus.POST);
};

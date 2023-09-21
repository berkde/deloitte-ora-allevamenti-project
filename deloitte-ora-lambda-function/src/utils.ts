import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyResult } from "aws-lambda";
import { AwsServiceError, CubbitServiceError } from "./errors";
import { HttpStatus } from "./httpStatus";
import { StatusCode } from "./statusCodes";

export const getObjectBucketResponse = async (
  getObjectBucket: any,
  getObjectBucketClient: any,
  key: string,
): Promise<APIGatewayProxyResult> => {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: getObjectBucket,
      Key: key,
    });

    let response = await getObjectBucketClient.send(getObjectCommand);
    return await response.Body?.transformToString();
  } catch (S3ServiceException) {
    return getErrorResult(new AwsServiceError(HttpStatus.BACKUP_KEY_NOT_FOUND, StatusCode.NOT_FOUND, HttpStatus.POST));
  }
};

export const sendObjectBucketResponse = async (
  sendObjectBucket: any,
  sendObjectBucketClient: any,
  key: string,
  responseStringBody: any,
): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      Bucket: sendObjectBucket,
      Key: key,
      Body: responseStringBody,
    };

    const command = new PutObjectCommand(params);
    return await sendObjectBucketClient.send(command);
  } catch (S3ServiceException) {
    return getErrorResult(
      new CubbitServiceError(HttpStatus.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, HttpStatus.POST),
    );
  }
};

export const getAllowHeaders = (type: string) => {
  if (type === "get") {
    return {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
      "Access-Control-Allow-Credentials": true,
    };
  } else if (type === "post") {
    return {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      "Access-Control-Allow-Credentials": true,
    };
  }
};

export const getErrorResult = (e: Error): APIGatewayProxyResult => {
  if (e instanceof AwsServiceError || e instanceof CubbitServiceError) {
    return {
      statusCode: e.statusCode,
      body: JSON.stringify({ error: e.message }),
      headers: getAllowHeaders(e.type),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify(e),
    headers: getAllowHeaders("get"),
  };
};

export const getSuccessResult = (data: any, type: string): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: data,
    headers: getAllowHeaders(type),
  };
};

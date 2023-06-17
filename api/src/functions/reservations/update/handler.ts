import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import schema from "./schema";

const dynamodbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  })
);

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log(event);

  try {
    const item = {
      pk: `RESERVATION#${event?.pathParameters?.pk}`,
      sk: `${event?.pathParameters?.sk}`,
      firstName: event.body.firstName,
      lastName: event.body.lastName,
      phoneNumber: event.body.phoneNumber,
      email: event.body.email,
      sex: event.body.sex,
      dob: event.body.dob,
      address: event.body.address,
      status: event.body.status,
    };

    const command = new PutCommand({
      TableName: process.env.APP_TABLE,
      Item: item,
    });

    await dynamodbClient.send(command);

    return formatJSONResponse({
      body: item,
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      message: "Internal Server Error",
    });
  }
};

export const main = middyfy(handler);

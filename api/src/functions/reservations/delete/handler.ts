import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  })
);

const handler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  console.log(event);

  try {
    await dynamodbClient.send(
      new DeleteCommand({
        TableName: process.env.APP_TABLE,
        Key: {
          pk: `RESERVATION#${event?.pathParameters?.pk}`,
          sk: `${event?.pathParameters?.sk}`,
        },
      })
    );

    return formatJSONResponse({});
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      message: "Internal Server Error",
    });
  }
};

export const main = middyfy(handler);

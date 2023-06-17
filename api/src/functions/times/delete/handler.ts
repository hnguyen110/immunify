import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

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
    const items = event.body.times.map((item) => ({
      pk: `TIME#${item.date}`,
      sk: `${item.time}`,
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [process.env.APP_TABLE]: items.map((item) => ({
          DeleteRequest: {
            Key: item,
          },
        })),
      },
    });

    await dynamodbClient.send(command);

    return formatJSONResponse({
      body: items,
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      message: "Internal Server Error",
    });
  }
};

export const main = middyfy(handler);

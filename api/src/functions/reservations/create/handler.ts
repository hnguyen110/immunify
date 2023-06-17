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
      pk: `RESERVATION#${event.body.date}`,
      sk: `${event.body.time}`,
      firstName: event.body.firstName,
      lastName: event.body.lastName,
      phoneNumber: event.body.phoneNumber,
      email: event.body.email,
      sex: event.body.sex,
      dob: event.body.dob,
      address: event.body.address,
      status: "SCHEDULED",
    };

    const command = new PutCommand({
      TableName: process.env.APP_TABLE,
      Item: item,
      ConditionExpression:
        "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });

    await dynamodbClient.send(command);

    return formatJSONResponse({
      body: item,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ConditionalCheckFailedException") {
      return formatJSONResponse(
        {
          message: "Reservation already exists",
        },
        400
      );
    } else {
      return formatJSONResponse(
        {
          message: "Internal Server Error",
        },
        500
      );
    }
  }
};

export const main = middyfy(handler);

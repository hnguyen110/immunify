import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

const dynamodbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  })
);

const handler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
  console.log(event);

  try {
    const params: QueryCommandInput = {
      TableName: process.env.APP_TABLE,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `TIME#${event?.queryStringParameters?.date}`,
      },
    };

    if (
      event?.queryStringParameters &&
      "key" in event?.queryStringParameters &&
      event?.queryStringParameters?.key !== ""
    ) {
      params.ExclusiveStartKey = {
        pk: `TIME#${event?.queryStringParameters?.date}`,
        sk: event.queryStringParameters.key,
      };
    }

    if (
      event?.queryStringParameters &&
      "limit" in event?.queryStringParameters
    ) {
      params.Limit = parseInt(event?.queryStringParameters?.limit);
    }

    const { Items, LastEvaluatedKey } = await dynamodbClient.send(
      new QueryCommand(params)
    );

    return formatJSONResponse({
      times: Items,
      key: LastEvaluatedKey?.sk,
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      message: "Internal Server Error",
    });
  }
};

export const main = middyfy(handler);

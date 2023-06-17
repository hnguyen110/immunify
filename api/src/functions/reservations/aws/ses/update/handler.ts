import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBRecord, SQSEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
});

const handler = async (event: SQSEvent) => {
  console.log(event);

  for (const record of event.Records) {
    const body = JSON.parse(record.body) as DynamoDBRecord;
    const image = unmarshall(body.dynamodb?.NewImage as any);
    await sesClient.send(
      new SendEmailCommand({
        Source: process.env.SES_SOURCE as string,
        Destination: {
          ToAddresses: [image.email as string],
        },
        Message: {
          Subject: {
            Data: "Reservation Updated",
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: JSON.stringify(image),
              Charset: "UTF-8",
            },
          },
        },
      })
    );
  }
};

export const main = handler;

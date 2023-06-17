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
            Data: "Reservation Created",
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: `<style>\n@font-face {\n  font-family: 'Roboto';\n  src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');\n}\n</style>\n\n<h1 style=\"font-family: 'Roboto', Arial, sans-serif; color: #333; margin-bottom: 20px;\">Reservation Confirmation</h1>\n<p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 10px; color: #333;\">Dear ${image.firstName} ${image.lastName},</p>\n<p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 10px; color: #333;\">Your appointment has been successfully booked. Here are the details:</p>\n<div style=\"background-color: #f7f7f7; padding: 10px; margin-top: 20px;\">\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Appointment ID:</strong> ${image.pk}</p>\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Date and Time:</strong> ${image.sk}</p>\n <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Phone Number:</strong> ${image.phoneNumber}</p>\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Email:</strong> ${image.email}</p>\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Sex:</strong> ${image.sex}</p>\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Date of Birth:</strong> ${image.dob}</p>\n  <p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 5px; color: #333;\"><strong>Address:</strong> ${image.address.line1}, ${image.address.city}, ${image.address.province}, ${image.address.country}, ${image.address.postalCode}</p>\n</div>\n<p style=\"font-family: 'Roboto', Arial, sans-serif; margin-bottom: 10px; color: #333;\">Best regards,<br>\nImmunify</p>`,
              Charset: "UTF-8",
            },
          },
        },
      })
    );
  }
};

export const main = handler;

import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": ["x38by3d3m09BD0F1A48", "Arn"],
        },
      },
    },
  ],
};

import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "times",
        request: {
          parameters: {
            querystrings: {
              date: true,
              key: false,
              limit: false,
            },
          },
        },
      },
    },
  ],
};

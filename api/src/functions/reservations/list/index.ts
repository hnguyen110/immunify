import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "reservations/{pk}",
        request: {
          parameters: {
            querystrings: {
              key: false,
              limit: false,
            },
          },
        },
      },
    },
  ],
};

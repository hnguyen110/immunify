import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "reservations/{pk}/{sk}",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};

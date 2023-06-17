export default {
  type: "object",
  properties: {
    times: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          date: {
            type: "string",
            format: "date",
          },
          time: {
            type: "string",
            format: "time",
          },
        },
        required: ["date", "time"],
      },
    },
  },
  required: ["times"],
} as const;

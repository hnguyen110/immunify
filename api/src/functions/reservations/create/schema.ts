export default {
  type: "object",
  properties: {
    date: { type: "string", format: "date" },
    time: { type: "string", format: "time" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    email: { type: "string" },
    sex: { type: "string" },
    dob: { type: "string", format: "date" },
    address: {
      type: "object",
      properties: {
        line1: { type: "string" },
        line2: { type: "string" },
        city: { type: "string" },
        province: { type: "string" },
        country: { type: "string" },
        postalCode: { type: "string" },
      },
      required: ["line1", "city", "province", "country", "postalCode"],
    },
  },
  required: [
    "date",
    "time",
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "sex",
    "dob",
    "address",
  ],
} as const;



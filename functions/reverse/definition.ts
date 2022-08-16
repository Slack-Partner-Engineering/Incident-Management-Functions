import {
  DefineFunction,
  Schema,
} from "deno-slack-sdk/mod.ts";

export const ReverseFunction = DefineFunction({
  callback_id: "reverse",
  title: "Reverse",
  description: "Takes a string and reverses it",
  source_file: "functions/reverse/mod.ts",
  input_parameters: {
    properties: {
      stringToReverse: {
        type: Schema.types.string,
        description: "The string to reverse",
      },
    },
    required: ["stringToReverse"],
  },
  output_parameters: {
    properties: {
      reverseString: {
        type: Schema.types.string,
        description: "The string in reverse",
      },
    },
    required: ["reverseString"],
  },
});
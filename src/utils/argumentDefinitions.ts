import { exporters } from "../exporters";

const exporterNames = exporters.map((e) => e.name);
const defaultExporter = exporterNames[0];

export type ArgumentType = "string" | "number" | "boolean" | "enum";

export enum Arg {
  help = "help",
  entrypoint = "entrypoint",
  buildoutput = "buildoutput",
  generator = "generator",
}

export interface ArgumentOptions {
  name: Arg | string;
  description: string;
  aliases?: string[];
  type: ArgumentType;
  choices?: string[];
  defaultValue?: any;
  required?: boolean;
}

export const argumentDefinitions: ArgumentOptions[] = [
  {
    name: Arg.help,
    description: "Display this help message",
    aliases: ["h"],
    type: "boolean",
    defaultValue: false,
  },
  {
    name: Arg.entrypoint,
    description: "Entrypoint file file (bunmake.js or bunmake.ts)",
    aliases: ["ep"],
    type: "string",
    required: false,
  },
  {
    name: Arg.buildoutput,
    description: "Specify output builddirectory",
    aliases: ["bo"],
    type: "string",
    required: true,
  },
  {
    name: Arg.generator,
    description: "Which generator to use",
    aliases: ["g"],
    type: "enum",
    choices: exporterNames,
    defaultValue: defaultExporter,
  },
];

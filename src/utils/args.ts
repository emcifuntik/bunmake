import { ArgumentOptions, ArgumentType, argumentDefinitions } from "./argumentDefinitions";

class Argument {
  name: string;
  description: string;
  aliases: string[];
  type: ArgumentType;
  choices?: string[];
  defaultValue: any;
  required: boolean;
  value: any;

  constructor(options: ArgumentOptions) {
    this.name = options.name;
    this.description = options.description;
    this.aliases = options.aliases || [];
    this.type = options.type;
    this.choices = options.choices;
    this.defaultValue = options.defaultValue;
    this.required = options.required || false;
    this.value = this.defaultValue; // Initialize with default value
  }
}

class Args {
  private static instance: Args;
  private args: string[];
  private arguments: Map<string, Argument>;
  private missingRequiredArgs: string[] = [];

  private constructor() {
    this.args = process.argv.slice(2);
    this.arguments = new Map();
  }

  public static getInstance(): Args {
    if (!Args.instance) {
      Args.instance = new Args();
    }
    return Args.instance;
  }

  defineArgument(options: ArgumentOptions): void {
    const arg = new Argument(options);
    this.arguments.set(arg.name, arg);
    arg.aliases.forEach((alias) => this.arguments.set(alias, arg));

    this.parseArgument(arg);
  }

  private parseArgument(arg: Argument): void {
    for (let i = 0; i < this.args.length; i++) {
      const current = this.args[i];

      if (current.startsWith("--")) {
        const [fullName, value] = current.slice(2).split("=", 2);
        if (fullName === arg.name || arg.aliases.includes(fullName)) {
          if (arg.type === "boolean") {
            arg.value = true;
          } else if (value !== undefined) {
            arg.value = this.castValue(value, arg);
          } else {
            if (i + 1 < this.args.length && !this.args[i + 1].startsWith("-")) {
              arg.value = this.castValue(this.args[i + 1], arg);
              i++;
            } else {
              console.error(`Expected a value for argument: --${fullName}`);
              this.showHelpAndExit();
            }
          }
        }
      } else if (current.startsWith("-")) {
        const flags = current.slice(1);
        for (let j = 0; j < flags.length; j++) {
          const flag = flags[j];
          if (arg.aliases.includes(flag)) {
            if (arg.type === "boolean") {
              arg.value = true;
            } else {
              if (
                j === flags.length - 1 &&
                i + 1 < this.args.length &&
                !this.args[i + 1].startsWith("-")
              ) {
                arg.value = this.castValue(this.args[i + 1], arg);
                i++;
              } else {
                console.error(`Expected a value for argument: -${flag}`);
                this.showHelpAndExit();
              }
            }
          }
        }
      }
    }
  }

  private castValue(value: string, arg: Argument): any {
    switch (arg.type) {
      case "number":
        const num = parseFloat(value);
        if (isNaN(num)) {
          console.error(`Invalid number value for --${arg.name}: ${value}`);
          this.showHelpAndExit();
        }
        return num;
      case "boolean":
        return value.toLowerCase() === "true";
      case "enum":
        if (!arg.choices || !arg.choices.includes(value)) {
          console.error(
            `Invalid value for --${arg.name}: ${value}. Allowed values are: ${arg.choices?.join(
              ", "
            )}`
          );
          this.showHelpAndExit();
        }
        return value;
      case "string":
      default:
        return value;
    }
  }

  private validateRequiredArguments(): void {
    this.arguments.forEach((arg, name) => {
      if (name === arg.name && arg.required && arg.value === undefined) {
        this.missingRequiredArgs.push(arg.name);
      }
    });

    if (this.missingRequiredArgs.length > 0) {
      console.error(
        `Missing required arguments: ${this.missingRequiredArgs
          .map((name) => `--${name}`)
          .join(", ")}`
      );
      console.log(this.showHelp());
      process.exit(1);
    }
  }

  private showHelpAndExit(): void {
    console.log(this.showHelp());
    process.exit(1);
  }

  public initialize(): void {
    this.validateRequiredArguments();
  }

  getArg(name: string): Argument | undefined {
    const arg = this.arguments.get(name);
    if (!arg) {
      return undefined;
    }
    return arg;
  }

  showHelp(): string {
    const helpMessage: string[] = ["Usage:", ""];
    const processedArgs = new Set<string>();

    this.arguments.forEach((arg) => {
      if (processedArgs.has(arg.name)) return;
      processedArgs.add(arg.name);

      const aliasList = arg.aliases.map((alias) => `-${alias}`).join(", ");
      const typeInfo =
        arg.type === "boolean"
          ? ""
          : arg.type === "enum" && arg.choices
          ? ` <${arg.choices.join("|")}>`
          : ` <${arg.type}>`;
      const defaultInfo =
        arg.defaultValue !== undefined ? ` [default: ${arg.defaultValue}]` : "";
      const requiredInfo = arg.required ? " (required)" : "";

      helpMessage.push(
        `--${arg.name}${aliasList ? `, ${aliasList}` : ""}${typeInfo} - ${arg.description}${defaultInfo}${requiredInfo}`
      );
    });

    return helpMessage.join("\n");
  }
}

const args = Args.getInstance();

argumentDefinitions.forEach((argDef) => {
  args.defineArgument(argDef);
});

args.initialize();

export { args };

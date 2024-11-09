# BunMake

BunMake is a powerful build tool and project generator designed and implemented with help of [Bun](https://bun.sh/) JavaScript runtime. It simplifies the process of configuring, building, and exporting projects, particularly for generating Visual Studio 2022 solution and project files.

## Features

- **Advanced Argument Parser**: Supports aliases, default values, required arguments, enums, and automatic help message generation.
- **Project Exporters**: Base class for project exporters with implementations for:
  - Visual Studio 2022 solution and project files exporter.
  - JSON project exporter (example implementation).
- **Singleton Design Pattern**: Ensures a single instance of the argument parser throughout the application.
- **Customizable Build Configurations**: Define debug and release configurations with specific compiler and linker flags.
- **CI/CD Integration**: GitHub Actions workflow for automated builds and releases upon tagging.

## Installation

To install BunMake, ensure you have [Bun](https://bun.sh/) installed on your system.

### Clone the Repository

```bash
git clone https://github.com/emcifuntik/bunmake.git
cd bunmake
```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
bun build --compile --minify --sourcemap --bytecode --target=bun-windows-x64 ./src/index.ts --outfile ./bin/bunmake.exe
```

Alternatively, you can use the provided NPM script:

```bash
npm run build
```

## Usage

After building, you can run `bunmake.exe` from the `./bin` directory.

```bash
./bin/bunmake.exe [options]
```

### Command-Line Options

| Option                       | Alias | Type                              | Description                                   | Default                | Required |
|------------------------------|-------|-----------------------------------|-----------------------------------------------|------------------------|----------|
| `--help`                     | `-h`  | Boolean                           | Display this help message                     | `false`                | No       |
| `--entrypoint <file>`        | `-ep` | String                            | Entrypoint file (bunmake.js or bunmake.ts)    |                        | No       |
| `--buildoutput <directory>`  | `-bo` | String                            | Specify output build directory                |                        | **Yes**  |
| `--generator <option>`       | `-g`  | Enum (`vs2022`, `json`, etc.) | Which generator to use | *First exporter in the list* | No       |

**Notes:**

- **`--help`**: Displays the help message with available options and usage.
- **`--entrypoint`**: Specifies the entrypoint file for the build process. If not provided, BunMake will look for `bunmake.js` or `bunmake.ts` in the current directory.
- **`--buildoutput`**: **Required**. Specifies the output directory where the build artifacts will be placed.
- **`--generator`**: Specifies which project generator to use. Available options are dynamically determined from the exporters you've defined (e.g., `vs2022`, `json`). The default is the first exporter in the list.

### Examples

- Display help message:

  ```bash
  bunmake.exe --help
  ```

- Generate a JSON export for debugging with default settings:

  ```bash
  bunmake.exe --buildoutput ./build
  ```

- Specify a custom entrypoint and generator:

  ```bash
  bunmake.exe --entrypoint ./myproject/bunmake.ts --buildoutput ./build --generator vs2022
  ```

- Use aliases for `--buildoutput` and `--generator`:

  ```bash
  bunmake.exe -bo ./build -g JSONProjectExporter
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Open a pull request against the `master` branch.

Please ensure that your code adheres to the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributors

- [ChatGPT](https://chat.com)

import { resolve } from "path";
import { existsSync } from "fs";
import "./declarations/api.js";
import { args } from "./utils/args.js";
import { Arg } from "./utils/argumentDefinitions.js";
import { exporters } from "./exporters/index.js";
import { getCurrentWorkspace } from "./workspacesCollection.js";

const BUNMAKE_JAVASCRIPT_FILENAME = "bunmake.js";
const BUNMAKE_TYPESCRIPT_FILENAME = "bunmake.ts";

async function entryPoint() {
  const help = args.getArg(Arg.help);
  if (help?.value === true) {
    args.showHelp();
    return;
  }

  const entrypointFile = args.getArg(Arg.entrypoint);

  let targetBunmakeFile = "";
  if (entrypointFile?.value !== undefined) {
    targetBunmakeFile = resolve(process.cwd(), entrypointFile.value);
  } else {
    const cwd = process.cwd();
    const bunmakeJsPath = resolve(cwd, BUNMAKE_JAVASCRIPT_FILENAME);
    const bunmakeTsPath = resolve(cwd, BUNMAKE_TYPESCRIPT_FILENAME);
  
    if (existsSync(bunmakeTsPath)) {
      targetBunmakeFile = bunmakeTsPath;
    } else if (existsSync(bunmakeJsPath)) {
      targetBunmakeFile = bunmakeJsPath;
    }
  }
  await import(targetBunmakeFile);

  const buildOutput = args.getArg(Arg.buildoutput);
  const generator = args.getArg(Arg.generator);

  const exporter = exporters.find((e) => e.name === generator?.value);
  if (exporter === undefined) {
    throw new Error(`Generator ${generator?.value} not found`);
  }

  const currentWorkspace = getCurrentWorkspace();
  console.log(currentWorkspace);
  const exporterInstance = new exporter.exporter(currentWorkspace);
  exporterInstance.export(buildOutput?.value);

  console.log("Build completed");
}

entryPoint();

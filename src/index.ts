import { resolve } from "path";
import { existsSync } from "fs";
import "./declarations/api.js";

const BUNMAKE_JAVASCRIPT_FILENAME = "bunmake.js";
const BUNMAKE_TYPESCRIPT_FILENAME = "bunmake.ts";

async function entryPoint() {
  // TODO: Arguments parsing and help message

  // use user-provided file
  const cwd = process.cwd();
  const bunmakeJsPath = resolve(cwd, BUNMAKE_JAVASCRIPT_FILENAME);
  const bunmakeTsPath = resolve(cwd, BUNMAKE_TYPESCRIPT_FILENAME);

  // check if file exists
  let targetBunmakeFile = "";
  if (existsSync(bunmakeTsPath)) {
    targetBunmakeFile = bunmakeTsPath;
  } else if (existsSync(bunmakeJsPath)) {
    targetBunmakeFile = bunmakeJsPath;
  }

  await import(targetBunmakeFile);

  console.log(JSON.stringify(global.__workspaces, null, 4));
}

entryPoint();

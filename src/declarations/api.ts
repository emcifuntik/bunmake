import { Configuration } from "./configuration.js";
import { TemplateConfiguration } from "./enums.js";
import { Workspace } from "./workspace.js";

declare global {
  var __workspaces: Workspace[];
}

global.__workspaces = [];

export function createConfiguration(name: string, from: TemplateConfiguration = TemplateConfiguration.Empty): Configuration {
  if (from === TemplateConfiguration.Debug) {
    return Configuration.fromDebug(name);
  } else if (from === TemplateConfiguration.Release) {
    return Configuration.fromRelease(name);
  }
  return new Configuration(name);
}

export function createWorkspace(name: string): Workspace {
  const workspace = new Workspace(name);
  global.__workspaces.push(workspace);
  return workspace;
}

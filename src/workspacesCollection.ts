import { Workspace } from './declarations/workspace.js';

declare global {
  var __workspace: Workspace | null;
}

global.__workspace = null as Workspace | null;

export function setCurrentWorkspace(workspace: Workspace): void {
  global.__workspace = workspace;
}

export function getCurrentWorkspace(): Workspace | null {
  return global.__workspace;
}


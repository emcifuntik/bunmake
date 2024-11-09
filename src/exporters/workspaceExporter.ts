import { Workspace } from '../declarations/workspace.js';

export abstract class WorkspaceExporter {
  protected workspace: Workspace;

  constructor(workspace: Workspace) {
    this.workspace = workspace;
  }

  /**
   * Abstract method that derived classes must implement to export the project.
   * @param outputPath The output folder path where the exported files will be saved.
   */
  abstract export(outputPath: string): void;

  /**
   * Method to validate the workspace before exporting.
   * Derived classes can override this if needed.
   */
  protected validateWorkspace(): boolean {
    return this.workspace.getProjects().length > 0;
  }
}

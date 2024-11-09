import { WorkspaceExporter } from './workspaceExporter.js';
import { Workspace } from '../declarations/workspace.js';
import * as fs from 'fs';
import * as path from 'path';

// Implemented for testing purposes
export class JSONExporter extends WorkspaceExporter {
  constructor(workspace: Workspace) {
    super(workspace);
  }

  /**
   * Exports the workspace to a JSON file in the specified output folder.
   * @param outputPath The output folder path where the exported JSON file will be saved.
   */
  export(outputPath: string): void {
    if (!this.validateWorkspace()) {
      throw new Error('Workspace validation failed.');
    }

    const workspaceData = this.serializeWorkspace();
    const outputFilePath = path.join(outputPath, `${this.workspace.getName()}.json`);

    fs.mkdirSync(outputPath, { recursive: true });
    fs.writeFileSync(outputFilePath, JSON.stringify(workspaceData, null, 2));
  }

  /**
   * Serializes the workspace into a plain object.
   */
  private serializeWorkspace(): object {
    return {
      name: this.workspace.getName(),
      projects: this.workspace.getProjects().map((project) => ({
        name: project.getName(),
        language: project.getLanguage(),
        type: project.getType(),
        libraryType: project.getLibraryType(),
        configurations: project.getConfigurations().map((config) => ({
          name: config.getName(),
          defines: Array.from(config.getDefines().entries()),
          optimization: config.getOptimization(),
          compilerFlags: config.getCompilerFlags(),
          linkerFlags: config.getLinkerFlags(),
          outputDir: config.getOutputDir(),
          includeDirs: config.getIncludeDirs(),
          forceIncludes: config.getForceIncludes(),
          libraries: config.getLibraries(),
          libraryDirs: config.getLibraryDirs(),
          preBuildCommands: config.getPreBuildCommands(),
          postBuildCommands: config.getPostBuildCommands(),
          preLinkCommands: config.getPreLinkCommands(),
          postLinkCommands: config.getPostLinkCommands(),
        })),
        sourceFiles: project.getSourceFiles(),
        includeDirs: project.getIncludeDirs(),
        libraries: project.getLibraries(),
      })),
    };
  }
}

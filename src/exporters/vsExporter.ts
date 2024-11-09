import { WorkspaceExporter } from '../exporters/workspaceExporter.js';
import { Workspace } from '../declarations/workspace.js';
import { Project } from '../declarations/project.js';
import { Configuration } from '../declarations/configuration.js';
import * as fs from 'fs';
import * as path from 'path';
import { create } from 'xmlbuilder2';
import { LibraryType, Optimization, ProjectType } from '../declarations/enums.js';

export class VisualStudioExporter extends WorkspaceExporter {
  constructor(workspace: Workspace) {
    super(workspace);
  }

  /**
   * Exports the workspace to Visual Studio solution and project files.
   * @param outputPath The output folder path where the exported files will be saved.
   */
  export(outputPath: string): void {
    if (!this.validateWorkspace()) {
      throw new Error('Workspace validation failed.');
    }

    // Ensure the output directory exists
    fs.mkdirSync(outputPath, { recursive: true });

    // Generate project files (.vcxproj)
    const projectGuids: Map<Project, string> = new Map();

    for (const project of this.workspace.getProjects()) {
      const projectGuid = this.generateProjectGuid();
      projectGuids.set(project, projectGuid);

      const projectFilePath = path.join(outputPath, `${project.getName()}.vcxproj`);
      const projectFiltersFilePath = path.join(outputPath, `${project.getName()}.vcxproj.filters`);

      const projectXml = this.generateVcxproj(project, projectGuid);
      fs.writeFileSync(projectFilePath, projectXml);

      const filtersXml = this.generateVcxprojFilters(project);
      fs.writeFileSync(projectFiltersFilePath, filtersXml);
    }

    // Generate solution file (.sln)
    const solutionFilePath = path.join(outputPath, `${this.workspace.getName()}.sln`);
    const solutionContent = this.generateSlnFile(this.workspace, projectGuids);
    fs.writeFileSync(solutionFilePath, solutionContent, 'utf8');

    console.log(`Visual Studio solution and project files exported to ${outputPath}`);
  }

  /**
   * Generates a unique project GUID.
   */
  private generateProjectGuid(): string {
    const hexDigits = '0123456789ABCDEF';
    let guid = '{';
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        guid += '-';
      } else {
        guid += hexDigits[Math.floor(Math.random() * 16)];
      }
    }
    guid += '}';
    return guid;
  }

  /**
   * Generates the content of a .vcxproj file for a given project.
   */
  private generateVcxproj(project: Project, projectGuid: string): string {
    const xml = create({ version: '1.0', encoding: 'utf-8' })
      .ele('Project', {
        DefaultTargets: 'Build',
        ToolsVersion: '17.0',
        xmlns: 'http://schemas.microsoft.com/developer/msbuild/2003',
      });

    // Add configurations
    const itemGroup = xml.ele('ItemGroup', { Label: 'ProjectConfigurations' });
    for (const config of project.getConfigurations()) {
      const projectConfig = itemGroup.ele('ProjectConfiguration', {
        Include: `${config.getName()}|${this.getPlatform()}`,
      });
      projectConfig.ele('Configuration').txt(config.getName());
      projectConfig.ele('Platform').txt(this.getPlatform());
    }

    // Global properties
    const globals = xml.ele('PropertyGroup', { Label: 'Globals' });
    globals.ele('ProjectGuid').txt(projectGuid);
    globals.ele('Keyword').txt('Win32Proj');
    globals.ele('RootNamespace').txt(project.getName());
    globals.ele('Platform').txt(this.getPlatform());

    // Import default props
    xml.ele('Import', { Project: '$(VCTargetsPath)\\Microsoft.Cpp.Default.props' });

    // Configuration property groups
    for (const config of project.getConfigurations()) {
      const props = xml.ele('PropertyGroup', {
        Condition: `'$(Configuration)|$(Platform)'=='${config.getName()}|${this.getPlatform()}'`,
        Label: 'Configuration',
      });

      props.ele('ConfigurationType').txt(this.getConfigurationType(project));
      props.ele('UseDebugLibraries').txt(this.useDebugLibraries(config));
      props.ele('PlatformToolset').txt('v143');
      props.ele('CharacterSet').txt('MultiByte');
    }

    // Import standard props
    xml.ele('Import', { Project: '$(VCTargetsPath)\\Microsoft.Cpp.props' });

    // Add property sheets
    xml.ele('ImportGroup', { Label: 'ExtensionSettings' });
    xml.ele('ImportGroup', { Label: 'Shared' });

    // Property sheets per configuration
    for (const config of project.getConfigurations()) {
      xml.ele('ImportGroup', {
        Label: 'PropertySheets',
        Condition: `'$(Configuration)|$(Platform)'=='${config.getName()}|${this.getPlatform()}'`,
      }).ele('Import', {
        Project: '$(UserRootDir)\\Microsoft.Cpp.$(Platform).user.props',
        Condition: "exists('$(UserRootDir)\\Microsoft.Cpp.$(Platform).user.props')",
        Label: 'LocalAppDataPlatform',
      });
    }

    // User macros
    xml.ele('PropertyGroup', { Label: 'UserMacros' });

    // Add custom properties per configuration
    for (const config of project.getConfigurations()) {
      const group = xml.ele('PropertyGroup', {
        Condition: `'$(Configuration)|$(Platform)'=='${config.getName()}|${this.getPlatform()}'`,
      });

      // Include directories
      if (project.getIncludeDirs().length > 0 || config.getIncludeDirs().length > 0) {
        const includeDirs = [
          ...project.getIncludeDirs(),
          ...config.getIncludeDirs(),
        ].map((dir) => this.normalizePath(dir));
        group
          .ele('IncludePath')
          .txt(includeDirs.join(';') + ';$(IncludePath)');
      }

      // Preprocessor definitions
      const defines = [
        ...Array.from(config.getDefines().keys()),
        ...(config.getOptimization() === Optimization.Off ? ['_DEBUG'] : ['NDEBUG']),
      ];
      group
        .ele('PreprocessorDefinitions')
        .txt(defines.join(';') + ';%(PreprocessorDefinitions)');
    }

    // Item definition groups per configuration
    for (const config of project.getConfigurations()) {
      const itemGroup = xml.ele('ItemDefinitionGroup', {
        Condition: `'$(Configuration)|$(Platform)'=='${config.getName()}|${this.getPlatform()}'`,
      });

      const clCompile = itemGroup.ele('ClCompile');
      clCompile.ele('WarningLevel').txt('Level3');
      clCompile.ele('Optimization').txt(this.getOptimizationLevel(config));

      // Additional compiler flags
      if (config.getCompilerFlags().length > 0) {
        clCompile
          .ele('AdditionalOptions')
          .txt(config.getCompilerFlags().join(' ') + ' %(AdditionalOptions)');
      }

      // Linker settings
      const link = itemGroup.ele('Link');
      if (config.getLinkerFlags().length > 0) {
        link
          .ele('AdditionalOptions')
          .txt(config.getLinkerFlags().join(' ') + ' %(AdditionalOptions)');
      }
    }

    // Add source files
    const sourceFiles = project.getSourceFiles();
    if (sourceFiles.length > 0) {
      const compileGroup = xml.ele('ItemGroup');
      for (const file of sourceFiles) {
        compileGroup.ele('ClCompile', { Include: this.normalizePath(file) });
      }
    }

    // Add header files (optional)
    // If you have header files, you can add them similarly

    // Import targets
    xml.ele('Import', { Project: '$(VCTargetsPath)\\Microsoft.Cpp.targets' });
    xml.ele('ImportGroup', { Label: 'ExtensionTargets' });

    return xml.end({ prettyPrint: true });
  }

  /**
   * Generates the content of a .vcxproj.filters file for a given project.
   */
  private generateVcxprojFilters(project: Project): string {
    const xml = create({ version: '1.0', encoding: 'utf-8' })
      .ele('Project', {
        ToolsVersion: '4.0',
        xmlns: 'http://schemas.microsoft.com/developer/msbuild/2003',
      });

    // Define filters
    const itemGroupFilters = xml.ele('ItemGroup');

    // For simplicity, we'll add a "Source Files" filter
    itemGroupFilters
      .ele('Filter', { Include: 'Source Files' })
      .ele('UniqueIdentifier')
      .txt(this.generateProjectGuid());

    // Add source files to the filter
    const sourceFiles = project.getSourceFiles();
    if (sourceFiles.length > 0) {
      const itemGroup = xml.ele('ItemGroup');
      for (const file of sourceFiles) {
        itemGroup
          .ele('ClCompile', { Include: this.normalizePath(file) })
          .ele('Filter')
          .txt('Source Files');
      }
    }

    return xml.end({ prettyPrint: true });
  }

  /**
   * Generates the content of the solution (.sln) file.
   */
  private generateSlnFile(
    workspace: Workspace,
    projectGuids: Map<Project, string>
  ): string {
    const lines: string[] = [];

    lines.push('Microsoft Visual Studio Solution File, Format Version 12.00');
    lines.push('# Visual Studio Version 17');
    lines.push('VisualStudioVersion = 17.0.31903.59');
    lines.push('MinimumVisualStudioVersion = 10.0.40219.1');

    for (const project of workspace.getProjects()) {
      const projectGuid = projectGuids.get(project);
      const projectTypeGuid = '{' + this.getProjectTypeGuid() + '}';

      const projectPath = `${project.getName()}.vcxproj`;

      lines.push(
        `Project("${projectTypeGuid}") = "${project.getName()}", "${projectPath}", "${projectGuid}"`
      );
      lines.push('EndProject');
    }

    lines.push('Global');
    lines.push('\tGlobalSection(SolutionConfigurationPlatforms) = preSolution');

    // Add configurations
    const configurations = new Set<string>();
    for (const project of workspace.getProjects()) {
      for (const config of project.getConfigurations()) {
        configurations.add(`${config.getName()}|${this.getPlatform()}`);
      }
    }
    for (const config of configurations) {
      lines.push(`\t\t${config} = ${config}`);
    }
    lines.push('\tEndGlobalSection');

    lines.push('\tGlobalSection(ProjectConfigurationPlatforms) = postSolution');
    for (const project of workspace.getProjects()) {
      const projectGuid = projectGuids.get(project);
      for (const config of project.getConfigurations()) {
        const configPlatform = `${config.getName()}|${this.getPlatform()}`;
        lines.push(
          `\t\t${projectGuid}.${configPlatform}.ActiveCfg = ${configPlatform}`
        );
        lines.push(
          `\t\t${projectGuid}.${configPlatform}.Build.0 = ${configPlatform}`
        );
      }
    }
    lines.push('\tEndGlobalSection');
    lines.push('\tGlobalSection(SolutionProperties) = preSolution');
    lines.push('\t\tHideSolutionNode = FALSE');
    lines.push('\tEndGlobalSection');
    lines.push('EndGlobal');

    return lines.join('\r\n');
  }

  /**
   * Returns the configuration type based on the project type.
   */
  private getConfigurationType(project: Project): string {
    switch (project.getType()) {
      case ProjectType.Executable:
        return 'Application';
      case ProjectType.Library:
        return project.getLibraryType() === LibraryType.Static ? 'StaticLibrary' : 'DynamicLibrary';
      default:
        return 'Application';
    }
  }

  /**
   * Determines whether to use debug libraries based on the configuration.
   */
  private useDebugLibraries(config: Configuration): string {
    return config.getOptimization() === Optimization.Off ? 'true' : 'false';
  }

  /**
   * Converts our optimization levels to Visual Studio's equivalents.
   */
  private getOptimizationLevel(config: Configuration): string {
    switch (config.getOptimization()) {
      case Optimization.Off:
        return 'Disabled';
      case Optimization.Level1:
        return 'MinSpace';
      case Optimization.Level2:
        return 'MaxSpeed';
      case Optimization.Level3:
        return 'Full';
      default:
        return 'Disabled';
    }
  }

  /**
   * Returns the platform for Visual Studio projects.
   */
  private getPlatform(): string {
    return 'x64';
  }

  /**
   * Returns the GUID for C++ projects in Visual Studio.
   */
  private getProjectTypeGuid(): string {
    // Visual C++ project type GUID
    return '8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942';
  }

  /**
   * Normalizes file paths to Windows-style with backslashes.
   */
  private normalizePath(p: string): string {
    return p.replace(/\//g, '\\');
  }
}

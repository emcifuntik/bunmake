module "bunmake" {
  function createConfiguration(name: string, from?: TemplateConfiguration): Configuration;
  function createWorkspace(name: string): Workspace;

  export class Configuration {
    private name: string;
    private defines: Map<string, string>;
    private optimization: Optimization;
    private compilerFlags: string[];
    private linkerFlags: string[];
    private outputDir?: string;
    private includeDirs: string[];
    private forceIncludes: string[];
    private libraries: string[];
    private libraryDirs: string[];
    private preBuildCommands: string[];
    private postBuildCommands: string[];
    private preLinkCommands: string[];
    private postLinkCommands: string[];

    addDefine(key: string, value: string): void;
    setOptimization(optimization: Optimization): void;
    addCompilerFlags(...flags: string[]): void;
    addLinkerFlags(...flags: string[]): void;
    setOutputDir(dir: string): void;
    addIncludeDirs(...dirs: string[]): void;
    addForceIncludes(...files: string[]): void;
    addLibraries(...libs: string[]): void;
    addLibraryDirs(...dirs: string[]): void;
    addPreBuildCommands(...cmds: string[]): void;
    addPostBuildCommands(...cmds: string[]): void;
    addPreLinkCommands(...cmds: string[]): void;
    addPostLinkCommands(...cmds: string[]): void;
    getName(): string;
    getDefines(): Map<string, string>;
    getOptimization(): Optimization;
    getCompilerFlags(): string[];
    getLinkerFlags(): string[];
    getOutputDir(): string | undefined;
    getIncludeDirs(): string[];
    getForceIncludes(): string[];
    getLibraries(): string[];
    getLibraryDirs(): string[];
    getPreBuildCommands(): string[];
    getPostBuildCommands(): string[];
    getPreLinkCommands(): string[];
    getPostLinkCommands(): string[];
  }

  export class Project {
    addConfiguration(config: Configuration): void;
    addSourceFiles(...files: string[]): void;
    addIncludeDirs(...dirs: string[]): void;
    addLibraries(...libs: string[]): void;
    setLanguage(language: Language): void;
    setType(type: ProjectType): void;
    setLibraryType(libraryType: LibraryType): void;
    getName(): string;
    getLanguage(): string;
    getType(): string;
    getLibraryType(): string;
    getConfigurations(): Configuration[];
    getSourceFiles(): string[];
    getIncludeDirs(): string[];
    getLibraries(): string[];
  }

  export class Workspace {
    private name: string;
    private projects: Project[];

    createProject(projectName: string, language: Language, type: ProjectType, libraryType: LibraryType): Project;
    getProjects(): Project[];
    getProject(name: string): Project | undefined;
    getName(): string;
  }

  export enum Language {
    Cpp = "C++",
    C = "C",
  }
  
  export enum Optimization {
    Off = "off",
    Level1 = "level1",
    Level2 = "level2",
    Level3 = "level3",
  }
  
  export enum ProjectType {
    Executable = "executable",
    Library = "library",
  }
  
  export enum LibraryType {
    Static = "static",
    Shared = "shared",
  }
  
  export enum TemplateConfiguration {
    Empty = "",
    Debug = "debug",
    Release = "release",
  }  
}
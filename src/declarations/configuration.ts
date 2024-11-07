import { Optimization } from "./enums.js";


export class Configuration {
  private name: string;
  private defines: Map<string, string>;
  private optimization: Optimization;
  private compilerFlags: string[] = [];
  private linkerFlags: string[] = [];
  private outputDir?: string;
  private includeDirs: string[] = [];
  private forceIncludes: string[] = [];
  private libraries: string[] = [];
  private libraryDirs: string[] = [];
  private preBuildCommands: string[] = [];
  private postBuildCommands: string[] = [];
  private preLinkCommands: string[] = [];
  private postLinkCommands: string[] = [];
  
  constructor(name: string) {
    this.name = name;
    this.defines = new Map();
    this.optimization = Optimization.Level3;
  }

  static fromDebug(name: string): Configuration {
    const config = new Configuration(name);
    config.optimization = Optimization.Off;
    return config;
  }

  static fromRelease(name: string): Configuration {
    const config = new Configuration(name);
    config.optimization = Optimization.Level3;
    return config;
  }

  addDefine(key: string, value: string): void {
    this.defines.set(key, value);
  }

  setOptimization(optimization: Optimization): void {
    this.optimization = optimization;
  }

  addCompilerFlags(...flags: string[]): void {
    this.compilerFlags.push(...flags);
  }

  addLinkerFlags(...flags: string[]): void {
    this.linkerFlags.push(...flags);
  }

  setOutputDir(dir: string): void {
    this.outputDir = dir;
  }

  addIncludeDirs(...dirs: string[]): void {
    this.includeDirs.push(...dirs);
  }

  addForceIncludes(...files: string[]): void {
    this.forceIncludes.push(...files);
  }

  addLibraries(...libs: string[]): void {
    this.libraries.push(...libs);
  }

  addLibraryDirs(...dirs: string[]): void {
    this.libraryDirs.push(...dirs);
  }

  addPreBuildCommands(...cmds: string[]): void {
    this.preBuildCommands.push(...cmds);
  }

  addPostBuildCommands(...cmds: string[]): void {
    this.postBuildCommands.push(...cmds);
  }

  addPreLinkCommands(...cmds: string[]): void {
    this.preLinkCommands.push(...cmds);
  }

  addPostLinkCommands(...cmds: string[]): void {
    this.postLinkCommands.push(...cmds);
  }

  getName(): string {
    return this.name;
  }

  getDefines(): Map<string, string> {
    return this.defines;
  }

  getOptimization(): Optimization {
    return this.optimization;
  }

  getCompilerFlags(): string[] {
    return this.compilerFlags;
  }

  getLinkerFlags(): string[] {
    return this.linkerFlags;
  }

  getOutputDir(): string | undefined {
    return this.outputDir;
  }

  getIncludeDirs(): string[] {
    return this.includeDirs;
  }

  getForceIncludes(): string[] {
    return this.forceIncludes;
  }

  getLibraries(): string[] {
    return this.libraries;
  }

  getLibraryDirs(): string[] {
    return this.libraryDirs;
  }

  getPreBuildCommands(): string[] {
    return this.preBuildCommands;
  }

  getPostBuildCommands(): string[] {
    return this.postBuildCommands;
  }

  getPreLinkCommands(): string[] {
    return this.preLinkCommands;
  }

  getPostLinkCommands(): string[] {
    return this.postLinkCommands;
  }
}

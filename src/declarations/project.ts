import { Configuration } from "./configuration.js";
import { Language, LibraryType, ProjectType } from "./enums.js";


export class Project {
  private name: string;
  private language: Language;
  private type: ProjectType;
  private libraryType: LibraryType;
  private configurations: Configuration[] = [];
  private sourceFiles: string[] = [];
  private includeDirs: string[] = [];
  private libraries: string[] = [];

  constructor(name: string, language: Language = Language.Cpp, type: ProjectType = ProjectType.Executable, libraryType: LibraryType = LibraryType.Shared) {
    this.name = name;
    this.language = language;
    this.type = type;
    this.libraryType = libraryType;
  }

  addConfiguration(config: Configuration): void
  {
    this.configurations.push(config);
  }

  addSourceFiles(...files: string[]): void
  {
    this.sourceFiles.push(...files);
  }

  addIncludeDirs(...dirs: string[]): void
  {
    this.includeDirs.push(...dirs);
  }

  addLibraries(...libs: string[]): void
  {
    this.libraries.push(...libs);
  }

  setLanguage(language: Language): void
  {
    this.language = language;
  }

  setType(type: ProjectType): void
  {
    this.type = type;
  }

  setLibraryType(libraryType: LibraryType): void
  {
    this.libraryType = libraryType;
  }

  // Getters
  getName(): string
  {
    return this.name;
  }

  getLanguage(): Language
  {
    return this.language;
  }

  getType(): ProjectType
  {
    return this.type;
  }

  getLibraryType(): LibraryType
  {
    return this.libraryType;
  }

  getConfigurations(): Configuration[]
  {
    return this.configurations;
  }

  getSourceFiles(): string[]
  {
    return this.sourceFiles;
  }

  getIncludeDirs(): string[]
  {
    return this.includeDirs;
  }

  getLibraries(): string[]
  {
    return this.libraries;
  }
}

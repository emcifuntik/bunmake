import { Language, LibraryType, ProjectType } from "./enums.js";
import { Project } from "./project.js";

export class Workspace {
  private name: string;
  private projects: Project[] = [];

  constructor(name: string) {
    this.name = name;
  }

  createProject(projectName: string, language: Language = Language.Cpp, type: ProjectType = ProjectType.Executable, libraryType: LibraryType = LibraryType.Shared): Project {
    const project = new Project(projectName, language, type, libraryType);
    this.projects.push(project);
    return project;
  }

  getProjects(): Project[] {
    return this.projects;
  }

  getProject(name: string): Project | undefined {
    return this.projects.find(p => p.getName() === name);
  }

  getName(): string { 
    return this.name;
  }
}

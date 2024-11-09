/// <reference path="../src/types/bunmake.d.ts" />
import { createWorkspace, createConfiguration, Language, ProjectType, LibraryType, TemplateConfiguration } from "bunmake";

const workspace = createWorkspace("BunmakeTest");
const project = workspace.createProject("BunmakeTest", Language.Cpp, ProjectType.Executable);
project.addSourceFiles("src/main.cpp");

const debugConfig = createConfiguration("Debug", TemplateConfiguration.Debug);
const releaseConfig = createConfiguration("Release", TemplateConfiguration.Release);

project.addConfiguration(debugConfig);
project.addConfiguration(releaseConfig);

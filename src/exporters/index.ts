import { JSONExporter } from './jsonExporter';
import { VisualStudioExporter } from './vsExporter.js';
import { WorkspaceExporter } from './workspaceExporter';

type WorkspaceExporterConstructor = new (...params: any[]) => WorkspaceExporter;

export interface ExportersListItem<T extends WorkspaceExporterConstructor = WorkspaceExporterConstructor> {
  name: string;
  exporter: T;
}

export const exporters: ExportersListItem[] = [
  {
    name: 'json',
    exporter: JSONExporter,
  },
  {
    name: 'vs2022',
    exporter: VisualStudioExporter,
  }
];

export interface VMTemplate {
  id: string;
  name: string;
  description: string;
  baseImage: string; // e.g. "ubuntu-22.04"
  vCpu: number; // number of vCPU cores, e.g. 4, 8, 16
  memoryGb: number; // RAM in GB, e.g. 8, 16, 32
  diskSizeGb: number; // disk in GB, e.g. 50, 100, 200
  preinstalledTools: string[]; // e.g. ["vscode-server", "docker", "node"]
}

export type VMTemplateInput = Omit<VMTemplate, "id">;

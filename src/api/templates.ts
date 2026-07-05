import type { VMTemplate, VMTemplateInput } from "@/types/template";
import { mockRequest } from "./client";
import { findTemplate, getAllTemplates, insertTemplate, patchTemplate } from "./store";

export function listTemplates(): Promise<VMTemplate[]> {
  return mockRequest(() => [...getAllTemplates()], { emptyValue: [] });
}

export function getTemplate(id: string): Promise<VMTemplate> {
  return mockRequest(() => {
    const template = findTemplate(id);
    if (!template) {
      throw new Error(`Template "${id}" was not found.`);
    }
    return { ...template };
  });
}

export function createTemplate(input: VMTemplateInput): Promise<VMTemplate> {
  return mockRequest(() => {
    const template: VMTemplate = {
      ...input,
      id: `tmpl-${crypto.randomUUID().slice(0, 8)}`,
    };
    return { ...insertTemplate(template) };
  });
}

export function updateTemplate(
  id: string,
  patch: Partial<VMTemplateInput>,
): Promise<VMTemplate> {
  return mockRequest(() => {
    if (!findTemplate(id)) {
      throw new Error(`Template "${id}" was not found.`);
    }
    return { ...patchTemplate(id, patch) };
  });
}

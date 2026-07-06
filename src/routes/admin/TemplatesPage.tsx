import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTemplates } from "@/hooks/useTemplates";
import { useCreateTemplate } from "@/hooks/useCreateTemplate";
import { useUpdateTemplate } from "@/hooks/useUpdateTemplate";
import type { VMTemplate, VMTemplateInput } from "@/types/template";

const EMPTY_FORM: VMTemplateInput = {
  name: "",
  description: "",
  baseImage: "",
  vCpu: 4,
  memoryGb: 16,
  diskSizeGb: 100,
  preinstalledTools: [],
};

export function TemplatesPage() {
  const templatesQuery = useTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VMTemplateInput>(EMPTY_FORM);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  }

  function openEditForm(template: VMTemplate) {
    setEditingId(template.id);
    setForm({
      name: template.name,
      description: template.description,
      baseImage: template.baseImage,
      vCpu: template.vCpu,
      memoryGb: template.memoryGb,
      diskSizeGb: template.diskSizeGb,
      preinstalledTools: template.preinstalledTools,
    });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (editingId) {
      updateTemplate.mutate({ id: editingId, patch: form }, { onSuccess: closeForm });
    } else {
      createTemplate.mutate(form, { onSuccess: closeForm });
    }
  }

  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  return (
    <PageContainer>
      <PageHeader
        breadcrumbs={[{ label: "Templates" }]}
        title="Templates"
        description="Reusable VM configurations developers can provision from."
      />

      {templatesQuery.isLoading ? (
        <LoadingSkeleton className="mt-8" />
      ) : templatesQuery.isError ? (
        <ErrorState
          className="mt-8"
          description="Couldn't load templates. Your data is safe — try again."
          onRetry={templatesQuery.refetch}
        />
      ) : (
        <>
          {isFormOpen && (
            <Card className="mt-8">
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <label className="col-span-2 flex flex-col gap-1.5 max-sm:col-span-1">
                    <span className="text-caption font-semibold text-text-secondary">Name</span>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>
                  <label className="col-span-2 flex flex-col gap-1.5 max-sm:col-span-1">
                    <span className="text-caption font-semibold text-text-secondary">Description</span>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-caption font-semibold text-text-secondary">Base image</span>
                    <Input
                      required
                      value={form.baseImage}
                      onChange={(e) => setForm({ ...form, baseImage: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-caption font-semibold text-text-secondary">vCPU</span>
                    <Input
                      required
                      type="number"
                      min={1}
                      value={form.vCpu}
                      onChange={(e) => setForm({ ...form, vCpu: Number(e.target.value) })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-caption font-semibold text-text-secondary">Memory (GB)</span>
                    <Input
                      required
                      type="number"
                      min={1}
                      value={form.memoryGb}
                      onChange={(e) => setForm({ ...form, memoryGb: Number(e.target.value) })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-caption font-semibold text-text-secondary">Disk (GB)</span>
                    <Input
                      required
                      type="number"
                      min={1}
                      value={form.diskSizeGb}
                      onChange={(e) => setForm({ ...form, diskSizeGb: Number(e.target.value) })}
                    />
                  </label>
                  <div className="col-span-2 flex gap-3">
                    <Button type="submit" size="sm" disabled={isSaving}>
                      {editingId ? "Save changes" : "Create template"}
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={closeForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8 overflow-hidden">
            <TableToolbar
              title="All templates"
              description={`${templatesQuery.data?.length ?? 0} templates`}
              action={
                !isFormOpen && (
                  <Button size="sm" onClick={openCreateForm}>
                    <Plus className="size-4" /> New template
                  </Button>
                )
              }
            />

            {!templatesQuery.data || templatesQuery.data.length === 0 ? (
              <EmptyState
                className="rounded-none border-none shadow-none"
                icon={Layers}
                title="No templates yet"
                description="Create your first VM template to get started."
              />
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle">
                    <th className="px-5 py-2.5 text-left text-overline text-text-muted">Name</th>
                    <th className="px-3 py-2.5 text-left text-overline text-text-muted">Base image</th>
                    <th className="px-3 py-2.5 text-right text-overline text-text-muted">vCPU</th>
                    <th className="px-3 py-2.5 text-right text-overline text-text-muted">Memory</th>
                    <th className="px-3 py-2.5 text-right text-overline text-text-muted">Disk</th>
                    <th className="px-5 py-2.5 text-right text-overline text-text-muted">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templatesQuery.data.map((template) => (
                    <tr key={template.id} className="border-b border-border last:border-none hover:bg-bg">
                      <td className="px-5 py-2.5 text-text">{template.name}</td>
                      <td className="px-3 py-2.5 font-mono text-text-secondary">{template.baseImage}</td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                        {template.vCpu}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                        {template.memoryGb} GB
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-text">
                        {template.diskSizeGb} GB
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditForm(template)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}

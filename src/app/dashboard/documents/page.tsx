import { Card } from "@/components/ui/card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DocumentUploadPanel } from "@/components/dashboard/document-upload-panel";
import { requireSession } from "@/lib/auth/session";
import { listCurrentUserDocuments } from "@/lib/account";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardDocumentsPage() {
  const session = await requireSession(["STUDENT", "CONSULTANT", "ADMIN"]);
  const documents = await listCurrentUserDocuments(session.userId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-slate-950">Documents</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Upload the CV, cover letter, or supporting files you want ready for reviews, workshops, and one-to-one sessions.
        </p>
      </Card>
      <DocumentUploadPanel />
      {documents.length ? (
        <Card className="p-6">
          <h2 className="font-semibold text-slate-950">Your uploaded documents</h2>
          <div className="mt-4 space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{document.fileName}</p>
                    <p className="mt-1 text-sm text-slate-600">{document.mimeType}</p>
                  </div>
                  <p className="text-sm text-slate-500">{formatDateTime(document.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <DashboardEmptyState
          title="No documents saved yet"
          description="Upload your CV, cover letter, or supporting documents here to keep them ready for reviews and coaching sessions."
        />
      )}
    </div>
  );
}

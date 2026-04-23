import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/http";
import { uploadDeliveredReviewDocument } from "@/lib/reviews";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Authentication required.");
  }

  return session;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("No review delivery file provided.");
    }

    const result = await uploadDeliveredReviewDocument({
      reviewRequestId: id,
      actorId: session.userId,
      file,
    });

    return jsonOk({ message: "Delivered review file uploaded.", document: result.document }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to upload delivered review file.");
  }
}

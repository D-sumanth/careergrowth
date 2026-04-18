import { jsonError, jsonOk, parseJson } from "@/lib/http";
import { resumeReviewSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const payload = await parseJson(request, resumeReviewSchema);
    return jsonOk(
      {
        message: "Resume review request submitted. Attach uploaded document IDs and reviewer assignments when connecting the live database flow.",
        reviewRequest: {
          id: `mock_review_${Date.now()}`,
          ...payload,
          status: "NEW",
        },
      },
      201,
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to submit review request.");
  }
}

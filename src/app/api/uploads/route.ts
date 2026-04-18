import { jsonError, jsonOk } from "@/lib/http";
import { storeUploadedFile } from "@/lib/storage/uploads";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonError("No file provided.");
    }

    const stored = await storeUploadedFile(file);
    return jsonOk({ message: "File uploaded successfully.", file: stored }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to upload file.");
  }
}

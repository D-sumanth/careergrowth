import { ZodSchema } from "zod";
import { NextResponse } from "next/server";

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const json = await request.json();
  return schema.parse(json);
}

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

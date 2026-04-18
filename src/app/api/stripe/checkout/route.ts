import { createCheckoutForService } from "@/lib/payments/stripe";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await createCheckoutForService({
      title: body.title ?? "Career consultation",
      amountPence: Number(body.amountPence ?? 8900),
      successPath: "/checkout/success",
      cancelPath: "/checkout/cancel",
      metadata: body.metadata,
    });
    return jsonOk({ message: "Checkout session created.", session });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to create checkout session.");
  }
}

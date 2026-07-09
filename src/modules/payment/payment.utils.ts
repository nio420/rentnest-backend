import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session
) => {
  console.log("Checkout session completed:", session.id);
  console.log("Metadata:", session.metadata);

  const rentalRequestId = session.metadata?.rentalRequestId;
  const tenantId = session.metadata?.tenantId;

  if (!rentalRequestId || !tenantId) {
    console.log("Missing metadata. Ignoring webhook.");
    return;
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session.id,
    },
  });

  if (existingPayment) {
    console.log("Payment already exists.");
    return;
  }

  await prisma.payment.create({
    data: {
      amount: (session.amount_total ?? 0) / 100,
      transactionId: String(session.payment_intent),
      stripeSessionId: session.id,
      status: "PAID",
      paidAt: new Date(),

      tenantId,
      rentalRequestId,
    },
  });

  console.log("Payment saved successfully.");
};
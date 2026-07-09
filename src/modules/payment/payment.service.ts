import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutSession } from "./payment.utils";

const createPaymentSessionDB = async (
  rentalId: string,
  tenantId: string
) => {

  const rental = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalId,
      tenantId,
      status: "APPROVED",
    },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new Error("Approved rental request not found!");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rental.property.title,
          },

          unit_amount: Math.round(rental.totalAmount * 100),
        },

        quantity: 1,
      },
    ],

    success_url: `${config.app_url}/payment-success`,
    cancel_url: `${config.app_url}/payment-cancel`,

    metadata: {
      rentalRequestId: rental.id,
      tenantId,
    },
  });

  return {
    paymentUrl: session.url,
  };
};

const confirmPaymentDB = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret
  );

  // 2. Filter everything except completed sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const rentalRequestId = session.metadata?.rentalRequestId;
    const tenantId = session.metadata?.tenantId;

    // Guard checking 
    if (!rentalRequestId || !tenantId) {
      console.log("Received test event without schema database metadata. Skipping registration.");
      return { received: true, simulated: true };
    }

    // 3. Confirm payment sequence isn't duplicated
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existingPayment) {
      console.log(" Payment session already tracked in Prisma.");
      return { received: true };
    }

    // 4. Create the final Payment 
    await prisma.payment.create({
      data: {
        amount: (session.amount_total ?? 0) / 100,
        transactionId: String(session.payment_intent || session.id),
        stripeSessionId: session.id,
        status: "PAID",
        paidAt: new Date(),
        tenantId,
        rentalRequestId,
      },
    });

    // 5. Update the parent RentalRequest status 
    await prisma.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: "COMPLETED" }, 
    });

    const rental = await prisma.rentalRequest.findUniqueOrThrow({
      where: {
        id: rentalRequestId
      },
      select: {
        propertyId: true
      }
    })

    await prisma.property.update({
      where: {
        id: rental.propertyId,
      },
      data: {
        status: "RENTED"
      }
    })

    console.log("RentNest Payment Log Saved Successfully!");
  }

  return { received: true };
};

const getMyPaymentsDB = async (tenantId: string) => {

  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  return payments;
};

const getSinglePaymentDB = async (
  paymentId: string,
  tenantId: string
) => {

  const payment = await prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,
      tenantId,
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  return payment;
};

export const paymentService = {
  createPaymentSessionDB,
  confirmPaymentDB,
  getMyPaymentsDB,
  getSinglePaymentDB,
};
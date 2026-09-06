import { prisma } from "../../lib/prisma";
import { ICreateRental, IUpdateRentalStatus } from "./rental.interface";

const createRentalDB = async (payload: ICreateRental, tenantId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found!");
  }

  if (property.status === "RENTED") {
    throw new Error("Property is not available!");
  }

  const totalAmount = property.rentPrice * payload.rentalMonths;

  const rental = await prisma.rentalRequest.create({
    data: {
      moveInDate: new Date(payload.moveInDate),
      rentalMonths: payload.rentalMonths,
      totalAmount,

      tenantId,
      propertyId: payload.propertyId,
    },
  });

  return rental;
};

const getMyRentalsDB = async (tenantId: string) => {
  const rentals = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },

    include: {
      property: {
        include: {
          reviews: {
            where: {
              tenantId,
            },
            select: {
              id: true,
            },
          },
        },
      },

      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};

const getSingleRentalDB = async (rentalId: string, tenantId: string) => {
  const rental = await prisma.rentalRequest.findFirstOrThrow({
    where: {
      id: rentalId,
      tenantId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  return rental;
};

const getLandlordRequestsDB = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          rentPrice: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const updateRentalStatusDB = async (
  rentalId: string,
  landlordId: string,
  status: IUpdateRentalStatus["status"],
) => {
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalId,
      property: {
        landlordId,
      },
    },
  });

  if (!rental) {
    throw new Error("Rental request not found!");
  }

  const updatedRental = await prisma.rentalRequest.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
  });

  return updatedRental;
};

const getTenantActivityDB = async (tenantId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      status: "PAID",
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const activities = payments.map((payment) => ({
    id: payment.id,
    type: "PAYMENT",
    title: "Payment completed",
    description: `${payment.rentalRequest.property.title} payment successful`,
    date: payment.createdAt,
  }));

  return activities;
};

const getTenantDashboardDB = async (userId: string) => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId: userId,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          rentPrice: true,
          location: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRentals = rentalRequests.length;

  const pendingRentals = rentalRequests.filter(
    (rental) => rental.status === "PENDING",
  ).length;

  const approvedRentals = rentalRequests.filter(
    (rental) => rental.status === "APPROVED",
  ).length;

  const rejectedRentals = rentalRequests.filter(
    (rental) => rental.status === "REJECTED",
  ).length;

  const totalAmount = rentalRequests.reduce(
    (sum, rental) => sum + rental.totalAmount,
    0,
  );

  return {
    overview: {
      totalRentals,
      pendingRentals,
      approvedRentals,
      rejectedRentals,
      totalAmount,
    },
    rentals: rentalRequests,
  };
};

export const rentalService = {
  createRentalDB,
  getMyRentalsDB,
  getSingleRentalDB,
  getLandlordRequestsDB,
  updateRentalStatusDB,
  getTenantActivityDB,
  getTenantDashboardDB,
};

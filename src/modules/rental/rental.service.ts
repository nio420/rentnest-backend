import { prisma } from "../../lib/prisma";
import { ICreateRental, IUpdateRentalStatus } from "./rental.interface";


const createRentalDB = async (
  payload: ICreateRental,
  tenantId: string
) => {

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

  const totalAmount =
    property.rentPrice * payload.rentalMonths;

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
      property: true,
      payment: true,
    },

  });
  return rentals;

};

const getSingleRentalDB = async (
  rentalId: string,
  tenantId: string
) => {

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
  });

  return requests;
};

const updateRentalStatusDB = async (
  rentalId: string,
  landlordId: string,
  status: IUpdateRentalStatus["status"]
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

export const rentalService = {
  createRentalDB,
  getMyRentalsDB,
  getSingleRentalDB,
  getLandlordRequestsDB,
  updateRentalStatusDB,
};
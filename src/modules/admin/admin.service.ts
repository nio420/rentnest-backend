import { prisma } from "../../lib/prisma";
import { IUpdateUserStatus } from "./admin.interface";

const getAllUsersDB = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
};

const updateUserStatusDB = async (
  userId: string,
  status: IUpdateUserStatus["status"]
) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
};

const getAllPropertiesDB = async () => {
  return await prisma.property.findMany({
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });
};

const getAllRentalsDB = async () => {
  return await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
      payment: true,
    },
  });
};

export const adminService = {
  getAllUsersDB,
  updateUserStatusDB,
  getAllPropertiesDB,
  getAllRentalsDB,
};
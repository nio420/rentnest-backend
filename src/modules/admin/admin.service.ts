import { prisma } from "../../lib/prisma";
import { IUpdateUserStatus } from "./admin.interface";

const getAllUsersDB = async (page = 1, limit = 10, searchTerm?: string) => {
  const skip = (page - 1) * limit;
  const where = searchTerm
    ? {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : undefined;

  const total = await prisma.user.count({
    where,
  });

  const totalPage = Math.ceil(total / limit);
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const meta = {
    page,
    limit,
    total,
    totalPage,
  };

  return {
    meta,
    data: users,
  };
};

const updateUserStatusDB = async (
  userId: string,
  status: IUpdateUserStatus["status"],
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

const getAllPropertiesDB = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await prisma.property.count();
  const totalPage = Math.ceil(total / limit);

  const properties = await prisma.property.findMany({
    skip,
    take: limit,

    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const meta = {
    page,
    limit,
    total,
    totalPage,
  };

  return {
    meta,
    data: properties,
  };
};

const getAllRentalsDB = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await prisma.rentalRequest.count();
  const totalPage = Math.ceil(total / limit);

  const rentals = await prisma.rentalRequest.findMany({
    skip,
    take: limit,

    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const meta = {
    page,
    limit,
    total,
    totalPage,
  };

  return {
    meta,
    data: rentals,
  };
};

const getDashboardStatsDB = async () => {
  const totalUsers = await prisma.user.count();
  const totalProperties = await prisma.property.count();

  const pendingRequests = await prisma.rentalRequest.count({
    where: {
      status: "PENDING",
    },
  });

  const completedRentals = await prisma.rentalRequest.count({
    where: {
      status: "COMPLETED",
    },
  });
  return {
    totalUsers,
    totalProperties,
    pendingRequests,
    completedRentals,
  };
};

export const adminService = {
  getAllUsersDB,
  updateUserStatusDB,
  getAllPropertiesDB,
  getAllRentalsDB,
  getDashboardStatsDB,
};

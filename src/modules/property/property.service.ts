import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IProperty, IPropertyQuery } from "./property.interface";

const createPropertyDB = async (
  payload: IProperty,
  landlordId: string
) => {

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!isCategoryExist) {
    throw new Error("Category not found!");
  }

  const isPropertyExist = await prisma.property.findFirst({
    where: {
      title: payload.title,
      landlordId,
    },
  });

  if (isPropertyExist) {
    throw new Error("You already created a property with this title!");
  }

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });

  return property;
};

const updatePropertyDB = async (
  id: string,
  payload: IProperty,
  landlordId: string
) => {

  const isPropertyExist = await prisma.property.findFirst({
    where: {
      id,
      landlordId,
    },
  });

  if (!isPropertyExist) {
    throw new Error("Property not found!");
  }

  if (payload.categoryId) {
    const isCategoryExist = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!isCategoryExist) {
      throw new Error("Category not found!");
    }
  }

  if (payload.title) {
    const duplicateProperty = await prisma.property.findFirst({
      where: {
        title: payload.title,
        landlordId,
        NOT: {
          id,
        },
      },
    });

    if (duplicateProperty) {
      throw new Error("You already created a property with this title!");
    }
  }

  const property = await prisma.property.update({
    where: {
      id,
    },
    data: payload,
  });

  return property;
};

const deletePropertyDB = async (
  id: string,
  landlordId: string
) => {

  const isPropertyExist = await prisma.property.findFirst({
    where: {
      id,
      landlordId,
    },
  });

  if (!isPropertyExist) {
    throw new Error("Property not found!");
  }

  await prisma.property.delete({
    where: {
      id,
    },
  });
};


const getAllPropertiesDB = async (query: IPropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // Search by title
  if (query.searchTerm) {
    andConditions.push({
      title: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    });
  }

  // Filter by location
  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }

  // Filter by category
  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  // Filter by amenities
  if (query.amenities) {
    andConditions.push({
      amenities: {
        hasSome: query.amenities.split(","),
      },
    });
  }

  // Filter by price range
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      rentPrice: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }

  // Only available properties
  andConditions.push({
    status: "AVAILABLE",
  });

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  const totalPropertyCount = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  const totalPage = Math.ceil(totalPropertyCount / limit);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total: totalPropertyCount,
      totalPage,
    },
  };
};


const getSinglePropertyDB = async (id: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },

    include: {
      category: true,

      landlord: {
        omit: {
          password: true,
        },
      },

      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
        },
      },
    },
  });

  return property;
};


export const propertyService = {
  createPropertyDB,
  updatePropertyDB,
  deletePropertyDB,
  getAllPropertiesDB,
  getSinglePropertyDB,
};
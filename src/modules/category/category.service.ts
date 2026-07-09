import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";


const createCategoryDB = async (payload: ICategory) => {
  const { name, description } = payload;

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (isCategoryExist) {
    throw new Error("Category already exists!");
  }

  const category = await prisma.category.create({
    data: {
        ...payload
    },
  });

  return category;
};

const getAllCategoriesDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const updateCategoryDB = async (
  id: string,
  payload: ICategory
) => {
  // Check category exists
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!isCategoryExist) {
    throw new Error("Category not found!");
  }

  // Check duplicate name 
  if (payload.name) {
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id,
        },
      },
    });

    if (duplicateCategory) {
      throw new Error("Category already exists!");
    }
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return category;
};

const deleteCategoryDB = async (id: string) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!isCategoryExist) {
    throw new Error("Category not found!");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategoryDB,
  getAllCategoriesDB,
  updateCategoryDB,
  deleteCategoryDB,
};
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.contoller";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryValidation } from "./category.validation";

const router = Router();

router.get("/",  categoryController.getAllCategories)
router.post("/", auth(Role.ADMIN), validateRequest(categoryValidation.createCategoryValidation), categoryController.createCategory)
router.patch("/:id", auth(Role.ADMIN), validateRequest(categoryValidation.updateCategoryValidation), categoryController.updateCategory)
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory)

export const categoryRouter = router;
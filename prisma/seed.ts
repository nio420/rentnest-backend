import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/client";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";

const seedAdmin = async () => {
    try {
  // Check if admin already exists
  const isAdminExist = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN,
    },
  });

  if (isAdminExist) {
    console.log("Admin already exists.");
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(config.admin_password, Number(config.bcrypt_salt_rounds));

  // Create Admin
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: config.admin_email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin created successfully.");      
    } catch (error) {
    console.log("Seed admin error:", error);
    }
};

async function main() {
  await seedAdmin();
}

main()
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

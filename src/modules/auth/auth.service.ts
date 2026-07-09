import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser, IRegisterUser } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserDB = async (payload: IRegisterUser) => {
    const { name, email, password, profilePhoto, role } = payload;

    const isUserExist = await prisma.user.findUnique({where: {email}})

    if (isUserExist) {
    throw new Error("User already exists with this email!");
    }  

    if(role === "ADMIN"){
        throw new Error("You can not register as an admin.")
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
    data: {
        name,
        email,
        password: hashedPassword,
        role,
        profilePhoto
    },
    omit: {password: true},
    })    
  
    return createdUser;
}

const loginUserDB = async (payload: IloginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {email},
    })
    
     if (user.status === "INACTIVE") {
        throw new Error("Your account is inactive. Please contact admin!");
     }
    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        throw new Error("Invalid Credentials!")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, {expiresIn: config.jwt_access_expiry} as SignOptions)
    
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, {expiresIn: config.jwt_refresh_expiry} as SignOptions)  
    
    return {
        accessToken, refreshToken
    }
}

const getMeDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authService = {
    registerUserDB,
    loginUserDB,
    getMeDB
}
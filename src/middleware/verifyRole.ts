import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        role: string;
      };
    }
  }
}

const verifyRole = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      // check if the session is valid
      if (!session) {
        res.status(401).json({
          success: false,
          message: "Unauthorize access",
        });
      }

      // check email verification
      if (!session?.user.emailVerified) {
        res.status(403).json({
          success: false,
          message: "Email is not verified",
        });
      }

      // add user to request
      req.user = {
        id: session?.user.id as string,
        name: session?.user.name as string,
        email: session?.user.email as string,
        emailVerified: session?.user.emailVerified as boolean,
        role: session?.user.role as string,
      };

      // verify role
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyRole;

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.errors.map((e) => e.message).join(", ");
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

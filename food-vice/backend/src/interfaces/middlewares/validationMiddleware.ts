import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export const logRequest= (req: Request, res: Response, next: NextFunction) => {

  console.log('Request Body',req.body)
  console.log('Request Query',req.query)
  next()

}
export const validateRequest = <T extends Record<string, unknown>>(
  schema: ZodSchema<T>
) =>
  (req: Request, res: Response, next: NextFunction) => {
    let result;

    if (req.file) {

      result = schema.safeParse({ ...req.body, file: req.file });
    } else if (req.files) {
      result = schema.safeParse({ ...req.body, files: req.files });
    } else {
      result = schema.safeParse(req.body);
    }

    if (result.success) {
      req.validatedBody = result.data;
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Request Validation Failed",
        errors: result.error.flatten(),
      });
    }
  };

export const validateQueryParams = <T extends Record<string, unknown>>(
  schema: ZodSchema<T>
) =>
  (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.query);

    if (result.success) {
      req.validatedQuery = result.data;
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "Query Parameters Validation Failed",
        errors: result.error.flatten(),
      });
    }
  };
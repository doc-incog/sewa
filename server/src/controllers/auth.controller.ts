import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const providerSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.providerSignup(req.body);
    res.status(201).json({
      success: true,
      message: "Provider account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    res.status(200).json({
      success: true,
      message: "Tokens refreshed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

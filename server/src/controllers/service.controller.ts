import { Request, Response, NextFunction } from "express";
import { Service } from "../models/Service";

export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search } = req.query;
    const filter: any = { active: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, data: { services } });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }
    res.status(200).json({ success: true, data: { service } });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Service.distinct("category", { active: true });
    res.status(200).json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

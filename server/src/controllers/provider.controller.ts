import { Request, Response, NextFunction } from "express";
import { Provider } from "../models/Provider";
import { AuthRequest } from "../middleware/auth.middleware";

export const getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("userId", "-password -__v")
      .populate("services");
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider not found" });
      return;
    }
    res.status(200).json({ success: true, data: { provider } });
  } catch (error) {
    next(error);
  }
};

export const getProvidersByService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const { minRating, maxPrice, lat, lng, radius } = req.query;

    const query: any = { services: serviceId };

    if (minRating) {
      query.avgRating = { $gte: parseFloat(minRating as string) };
    }

    if (lat && lng && radius) {
      query.serviceArea = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng as string), parseFloat(lat as string)] },
          $maxDistance: parseInt(radius as string) * 1000,
        },
      };
    }

    const providers = await Provider.find(query)
      .populate("userId", "-password -__v")
      .populate("services")
      .sort({ avgRating: -1 });

    res.status(200).json({ success: true, data: { providers } });
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { verified } = req.query;
    const filter: any = {};
    if (verified !== undefined) filter.verified = verified === "true";

    const providers = await Provider.find(filter)
      .populate("userId", "-password -__v")
      .populate("services")
      .sort({ avgRating: -1 });

    res.status(200).json({ success: true, data: { providers } });
  } catch (error) {
    next(error);
  }
};

export const updateProviderProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await Provider.findOne({ userId: req.user!.userId });
    if (!provider) {
      res.status(404).json({ success: false, message: "Provider profile not found" });
      return;
    }

    const allowedUpdates = ["businessName", "description", "services", "serviceArea", "availability"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (provider as any)[field] = req.body[field];
      }
    });

    await provider.save();
    res.status(200).json({ success: true, data: { provider } });
  } catch (error) {
    next(error);
  }
};

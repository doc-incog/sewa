import { Request, Response, NextFunction } from "express";
import { Provider } from "../models/Provider";
import { Service } from "../models/Service";

export const searchProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, service, minRating, maxPrice, minPrice, lat, lng, radius, verified, sort } = req.query;

    const query: any = {};

    if (q) {
      const serviceIds = await Service.find({
        name: { $regex: q, $options: "i" },
      }).select("_id");
      query.services = { $in: serviceIds.map((s) => s._id) };
    }

    if (service) {
      query.services = service;
    }

    if (minRating) {
      query.avgRating = { $gte: parseFloat(minRating as string) };
    }

    if (verified === "true") {
      query.verified = true;
    }

    if (lat && lng && radius) {
      query.serviceArea = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng as string), parseFloat(lat as string)] },
          $maxDistance: parseInt(radius as string) * 1000,
        },
      };
    }

    let sortOptions: any = { avgRating: -1 };
    if (sort === "price_asc") sortOptions = { avgRating: -1 };
    if (sort === "rating") sortOptions = { avgRating: -1 };
    if (sort === "jobs") sortOptions = { totalJobs: -1 };
    if (sort === "newest") sortOptions = { createdAt: -1 };

    let providers = await Provider.find(query)
      .populate("userId", "-password -__v")
      .populate("services")
      .sort(sortOptions);

    if (maxPrice || minPrice) {
      providers = providers.filter((p) => {
        return p.services.some((svc) => {
          const service = svc as any;
          if (maxPrice && service.basePrice > parseFloat(maxPrice as string)) return false;
          if (minPrice && service.basePrice < parseFloat(minPrice as string)) return false;
          return true;
        });
      });
    }

    res.status(200).json({ success: true, data: { providers, total: providers.length } });
  } catch (error) {
    next(error);
  }
};

export const searchServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const filter: any = { active: true };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (minPrice) filter.basePrice = { ...filter.basePrice, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.basePrice = { ...filter.basePrice, $lte: parseFloat(maxPrice as string) };

    const services = await Service.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, data: { services, total: services.length } });
  } catch (error) {
    next(error);
  }
};

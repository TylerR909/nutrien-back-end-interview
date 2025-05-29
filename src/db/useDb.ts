import { RequestHandler } from "express";
import { db } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      db: typeof db;
    }
  }
}

export const useDb: RequestHandler = (req, res, next) => {
  req.db = db;
  next();
};

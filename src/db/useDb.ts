import { RequestHandler } from "express";
import { db } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      db: typeof db;
    }
  }
}

/**
 * Connects the db object to `req.db` so routes can make database requests.
 *
 * TODO: Update to be a connection pool so multiple requests can be handled at once without using the
 *       same DB connection.
 * TODO: Proxy `req.db` so it's not acquired until a Route actually tries to use it. This should cut
 *       down on connections being handed out to routes that won't even need them.
 */
export const useDb: RequestHandler = (req, res, next) => {
  req.db = db;
  next();
};

import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import ApiLog from "../model/logs.js";

const operationByMethod = {
  GET: "read",
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
};

export const logApiRequest = (req, res, next) => {
  if (!Object.hasOwn(operationByMethod, req.method)) {
    return next();
  }
  const operation = operationByMethod[req.method];

  const requestId = randomUUID();
  const startedAt = process.hrtime.bigint();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.once("finish", () => {
    const statusCode = res.statusCode;
    const pathSegments = req.originalUrl.split("?")[0].split("/").filter(Boolean);
    const logEntry = {
      requestId,
      request: {
        method: req.method,
        endpoint: `/${pathSegments.join("/")}`,
      },
      operation,
      resource: pathSegments[1],
      statusCode,
      success: statusCode < 400,
      durationMs: Number(process.hrtime.bigint() - startedAt) / 1e6,
    };

    if (req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)) {
      logEntry.actor = req.user.id;
    }

    if (typeof res.locals.errorCode === "string" && res.locals.errorCode.trim()) {
      logEntry.errorCode = res.locals.errorCode.trim();
    }

    ApiLog.create(logEntry).catch((error) => {
      console.error(`Failed to persist API log ${requestId}:`, error);
    });
  });

  next();
};
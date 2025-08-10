import { validationResult } from 'express-validator';

export function runValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(400).json({
    error: 'ValidationError',
    details: result.array().map(e => ({ field: e.param, msg: e.msg })),
  });
}

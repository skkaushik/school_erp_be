import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to restrict access based on user roles.
 * Must be used AFTER authMiddleware.
 * 
 * @param {...string} allowedRoles - Spread of allowed roles (e.g., 'admin', 'teacher')
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ApiError(403, "Access denied: Role not identified."));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, `Access denied: Required role is ${allowedRoles.join(" or ")}.`));
        }

        next();
    };
};

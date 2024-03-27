// Validation for all user payloads

import { object, string, z } from "zod";

export const registerSchema = object({
  body: object({
    fullName: string({
      required_error: "Full name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(8, "Password must be a minimum of 8 characters"),
  }),
});

export const verifyUserSchema = object({
  query: object({
    verificationCode: string({
      required_error: "Verification code is required",
    }),
    userId: string({
      required_error: "User ID is required",
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email provided"),
  }),
});

export const resetPasswordSchema = object({
  query: object({
    passwordResetCode: string({
      required_error: "Password Reset Code is required",
    }),
    userId: string({
      required_error: "User ID is required",
    }),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export const updatePasswordSchema = object({
  body: object({
    currentPassword: string({
      required_error: "Current Password is required",
    }),
    newPassword: string({
      required_error: "New Password is required",
    }),
  }),
});

export const fetchUsersSchema = object({
  query: object({
    page: string().optional(),
    pageSize: string().optional(),
    searchQuery: string().optional(),
    filter: z.enum(["newest", "oldest"]).optional(),
    userType: z.enum(["admin", "user"]).optional(),
  }),
});


 

// // // "use server"

// // // import { cookies } from "next/headers"
// // // import { redirect } from "next/navigation"
// // // import jwt, { JwtPayload } from "jsonwebtoken"
// // // import { z } from "zod"

// // // export type LoginState = {
// // //   success: boolean
// // //   statusCode?: number
// // //   message : any
// // //   redirectTo?: string 
// // //   data?: {
// // //     accessToken?: string
// // //     refreshToken?: string
// // //   }
// // // }

// // // export type RegisterState = {
// // //   success: boolean
// // //   errors?: { field: string; message: string }[]
// // //   data?: any
// // // }






// // // export const loginAction = async (prevState: LoginState, formData: FormData) => {
// // //   const email = formData.get("email")
// // //   const password = formData.get("password")

// // //   try {
// // //     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ email, password }),
// // //     })

// // //     const result = await res.json()

// // //     if (!result.success) {
// // //       return { success: false, message: result.message || "Invalid credentials" }
// // //     }

// // //     const accessToken = result.data?.accessToken || result.accessToken
// // //     const refreshToken = result.data?.refreshToken || result.refreshToken

// // //     if (!accessToken) {
// // //       return { success: false, message: "No access token received" }
// // //     }

// // //     const decoded = jwt.decode(accessToken) as JwtPayload
// // //     const role = decoded?.role || "CUSTOMER"

// // //     // ✅ Return tokens to client (instead of setting cookies here)
// // //     let redirectTo = "/"
// // //     if (role === "ADMIN") {
// // //       redirectTo = "/admin_dashboard"
// // //     } else if (role === "TECHNICIAN") {
// // //       redirectTo = "/technician_dashboard"
// // //     } else {
// // //       redirectTo = "/customer_dashboard"
// // //     }

// // //     return {
// // //       success: true,
// // //       message: "Login successful",
// // //       redirectTo,
// // //       data: {
// // //         accessToken,
// // //         refreshToken,
// // //       }
// // //     }

// // //   } catch (error) {
// // //     console.error("Login error:", error)
// // //     return { success: false, message: "Something went wrong. Please try again." }
// // //   }
// // // }


// // // // ... registerSchema and registerUser remain same

// // // // ============================================
// // // // REGISTER SCHEMA
// // // // ============================================

// // // const registerSchema = z.object({
// // //   name: z.string().min(2, "Name must be at least 2 characters"),
// // //   email: z.string().email("Invalid email address"),
// // //   phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
// // //   location: z.string().min(2, "Location is required"),
// // //   password: z.string()
// // //     .min(8, "Password must be at least 8 characters")
// // //     .regex(/[A-Z]/, "Must contain uppercase")
// // //     .regex(/[a-z]/, "Must contain lowercase")
// // //     .regex(/[0-9]/, "Must contain a number"),
// // //   confirmPassword: z.string(),
// // //   role: z.enum(["CUSTOMER", "TECHNICIAN"]),
// // // }).refine((d) => d.password === d.confirmPassword, {
// // //   message: "Passwords don't match",
// // //   path: ["confirmPassword"],
// // // })

// // // // ============================================
// // // // REGISTER ACTION
// // // // ============================================

// // // export async function registerUser(
// // //   prevState: RegisterState | undefined,
// // //   formData: FormData
// // // ): Promise<RegisterState> {
// // //   const raw = {
// // //     name: formData.get("name"),
// // //     email: formData.get("email"),
// // //     phone: formData.get("phone"),
// // //     location: formData.get("location"),
// // //     password: formData.get("password"),
// // //     confirmPassword: formData.get("confirmPassword"),
// // //     role: formData.get("role"),
// // //   }

// // //   const result = registerSchema.safeParse(raw)

// // //   if (!result.success) {
// // //     return {
// // //       success: false,
// // //       errors: result.error.issues.map((err) => ({
// // //         field: err.path[0]?.toString() || "",
// // //         message: err.message,
// // //       })),
// // //       data: raw,
// // //     }
// // //   }

// // //   const { name, email, phone, location, password, role } = result.data

// // //   try {
// // //     const response = await fetch(
// // //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
// // //       {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ name, email, phone, location, password, role }),
// // //       }
// // //     )

// // //     const data = await response.json()

// // //     if (!response.ok) {
// // //       return {
// // //         success: false,
// // //         errors: [{ field: "general", message: data.message || "Registration failed" }],
// // //         data: raw,
// // //       }
// // //     }

// // //     return {
// // //       success: true,
// // //       errors: [],
// // //       data: { name, email, phone, location, role },
// // //     }
// // //   } catch (error) {
// // //     console.error("Registration error:", error)
// // //     return {
// // //       success: false,
// // //       errors: [{ field: "general", message: "Something went wrong. Please try again." }],
// // //       data: raw,
// // //     }
// // //   }
// // // }

// // // app/(auth_group)/_auth_action/auth.action.ts

// // "use server";

// // import jwt, { JwtPayload } from "jsonwebtoken";
// // import { z } from "zod";

// // // ============================================
// // // TYPES
// // // ============================================

// // export type LoginState = {
// //   success: boolean;
// //   statusCode?: number;
// //   message: string;
// //   redirectTo?: string;
// //   data?: {
// //     accessToken?: string;
// //     refreshToken?: string;
// //   };
// // };

// // export type RegisterState = {
// //   success: boolean;
// //   errors?: { field: string; message: string }[];
// //   data?: any;
// // };

// // interface AuthResponse {
// //   success: boolean;
// //   message?: string;
// //   data?: {
// //     accessToken?: string;
// //     refreshToken?: string;
// //     user?: {
// //       id: string;
// //       name: string;
// //       email: string;
// //       role: string;
// //     };
// //   };
// // }

// // // ============================================
// // // LOGIN ACTION
// // // ============================================

// // export const loginAction = async (
// //   prevState: LoginState,
// //   formData: FormData
// // ): Promise<LoginState> => {
// //   const email = formData.get("email") as string;
// //   const password = formData.get("password") as string;

// //   try {
// //     // Validate input
// //     if (!email || !password) {
// //       return {
// //         success: false,
// //         message: "Email and password are required",
// //       };
// //     }

// //     console.log("🔍 Sending Login Request:", { email });

// //     const res = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password }),
// //       }
// //     );

// //     const result: AuthResponse = await res.json();
// //     console.log("📦 Login Response:", JSON.stringify(result, null, 2));

// //     if (!result.success) {
// //       return {
// //         success: false,
// //         message: result.message || "Invalid credentials",
// //       };
// //     }

// //     // ✅ Tokens নিন data object থেকে
// //     const accessToken = result.data?.accessToken;
// //     const refreshToken = result.data?.refreshToken;

// //     console.log("🔑 Access Token:", accessToken ? "✅ Received" : "❌ Missing");

// //     if (!accessToken) {
// //       return {
// //         success: false,
// //         message: "No access token received from server",
// //       };
// //     }

// //     // ✅ Decode JWT to get role
// //     let decoded: JwtPayload | null = null;
// //     try {
// //       decoded = jwt.decode(accessToken) as JwtPayload;
// //       console.log("👤 Decoded Token:", decoded);
// //     } catch (error) {
// //       console.error("Token decode error:", error);
// //     }

// //     const role = (decoded?.role as string) || "CUSTOMER";
// //     console.log("🎭 User Role:", role);

// //     // ✅ Determine redirect path
// //     let redirectTo = "/";
// //     if (role === "ADMIN") {
// //       redirectTo = "/admin_dashboard";
// //     } else if (role === "TECHNICIAN") {
// //       redirectTo = "/technician_dashboard";
// //     } else {
// //       redirectTo = "/customer_dashboard";
// //     }

// //     return {
// //       success: true,
// //       message: result.message || "Login successful",
// //       redirectTo,
// //       data: {
// //         accessToken,
// //         refreshToken,
// //       },
// //     };
// //   } catch (error) {
// //     console.error("Login error:", error);
// //     return {
// //       success: false,
// //       message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
// //     };
// //   }
// // };

// // // ============================================
// // // REGISTER SCHEMA (Zod Validation)
// // // ============================================

// // const registerSchema = z.object({
// //   name: z.string().min(2, "Name must be at least 2 characters"),
// //   email: z.string().email("Invalid email address"),
// //   phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
// //   location: z.string().min(2, "Location is required"),
// //   password: z
// //     .string()
// //     .min(8, "Password must be at least 8 characters")
// //     .regex(/[A-Z]/, "Must contain uppercase")
// //     .regex(/[a-z]/, "Must contain lowercase")
// //     .regex(/[0-9]/, "Must contain a number"),
// //   confirmPassword: z.string(),
// //   role: z.enum(["CUSTOMER", "TECHNICIAN"]),
// // }).refine((data) => data.password === data.confirmPassword, {
// //   message: "Passwords don't match",
// //   path: ["confirmPassword"],
// // });

// // // ============================================
// // // REGISTER ACTION
// // // ============================================

// // export async function registerUser(
// //   prevState: RegisterState | undefined,
// //   formData: FormData
// // ): Promise<RegisterState> {
// //   const raw = {
// //     name: formData.get("name") as string,
// //     email: formData.get("email") as string,
// //     phone: formData.get("phone") as string,
// //     location: formData.get("location") as string,
// //     password: formData.get("password") as string,
// //     confirmPassword: formData.get("confirmPassword") as string,
// //     role: formData.get("role") as "CUSTOMER" | "TECHNICIAN",
// //   };

// //   console.log("📝 Registration Data:", { ...raw, password: "******" });

// //   const result = registerSchema.safeParse(raw);

// //   if (!result.success) {
// //     return {
// //       success: false,
// //       errors: result.error.issues.map((err) => ({
// //         field: err.path[0]?.toString() || "",
// //         message: err.message,
// //       })),
// //       data: raw,
// //     };
// //   }

// //   const { name, email, phone, location, password, role } = result.data;

// //   try {
// //     const response = await fetch(
// //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ name, email, phone, location, password, role }),
// //       }
// //     );

// //     const data = await response.json();

// //     if (!response.ok) {
// //       return {
// //         success: false,
// //         errors: [
// //           { field: "general", message: data.message || "Registration failed" },
// //         ],
// //         data: raw,
// //       };
// //     }

// //     return {
// //       success: true,
// //       errors: [],
// //       data: { name, email, phone, location, role },
// //     };
// //   } catch (error) {
// //     console.error("Registration error:", error);
// //     return {
// //       success: false,
// //       errors: [
// //         {
// //           field: "general",
// //           message: "Something went wrong. Please try again.",
// //         },
// //       ],
// //       data: raw,
// //     };
// //   }
// // }
// // app/(auth_group)/_auth_action/auth.action.ts

// "use server";

// import jwt, { JwtPayload } from "jsonwebtoken";
// import { z } from "zod";

// // ============================================
// // TYPES
// // ============================================

// export type LoginState = {
//   success: boolean;
//   statusCode?: number;
//   message: string;
//   redirectTo?: string;
//   data?: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
// };

// export type RegisterState = {
//   success: boolean;
//   errors?: { field: string; message: string }[];
//   data?: any;
// };

// interface AuthResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     accessToken?: string;
//     refreshToken?: string;
//     user?: {
//       id: string;
//       name: string;
//       email: string;
//       role: string;
//     };
//   };
// }

// // ============================================
// // HELPER: Safe String Getter
// // ============================================

// const getString = (value: FormDataEntryValue | null): string => {
//   if (!value) return "";
//   return value.toString();
// };

// // ============================================
// // LOGIN ACTION
// // ============================================

// export const loginAction = async (
//   prevState: LoginState,
//   formData: FormData
// ): Promise<LoginState> => {
//   // ✅ Safe string extraction
//   const email = getString(formData.get("email"));
//   const password = getString(formData.get("password"));

//   try {
//     // Validate input
//     if (!email || !password) {
//       return {
//         success: false,
//         message: "Email and password are required",
//       };
//     }

//     console.log("🔍 Sending Login Request:", { email });

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       }
//     );

//     const result: AuthResponse = await res.json();
//     console.log("📦 Login Response:", JSON.stringify(result, null, 2));

//     if (!result.success) {
//       return {
//         success: false,
//         message: result.message || "Invalid credentials",
//       };
//     }

//     // ✅ Safe token extraction
//     const accessToken = result.data?.accessToken || "";
//     const refreshToken = result.data?.refreshToken || "";

//     console.log("🔑 Access Token:", accessToken ? "✅ Received" : "❌ Missing");

//     if (!accessToken) {
//       return {
//         success: false,
//         message: "No access token received from server",
//       };
//     }

//     // ✅ Decode JWT to get role
//     let role = "CUSTOMER";
//     try {
//       const decoded = jwt.decode(accessToken) as JwtPayload;
//       console.log("👤 Decoded Token:", decoded);
      
//       // ✅ Safe role extraction
//       if (decoded && typeof decoded === "object" && "role" in decoded) {
//         role = decoded.role as string;
//       }
//     } catch (error) {
//       console.error("Token decode error:", error);
//     }

//     console.log("🎭 User Role:", role);

//     // ✅ Determine redirect path
//     let redirectTo = "/";
//     if (role === "ADMIN") {
//       redirectTo = "/admin_dashboard";
//     } else if (role === "TECHNICIAN") {
//       redirectTo = "/technician_dashboard";
//     } else {
//       redirectTo = "/customer_dashboard";
//     }

//     return {
//       success: true,
//       message: result.message || "Login successful",
//       redirectTo,
//       data: {
//         accessToken,
//         refreshToken,
//       },
//     };
//   } catch (error) {
//     console.error("Login error:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
//     };
//   }
// };

// // ============================================
// // REGISTER SCHEMA (Zod Validation)
// // ============================================

// const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
//   location: z.string().min(2, "Location is required"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(/[A-Z]/, "Must contain uppercase")
//     .regex(/[a-z]/, "Must contain lowercase")
//     .regex(/[0-9]/, "Must contain a number"),
//   confirmPassword: z.string(),
//   role: z.enum(["CUSTOMER", "TECHNICIAN"]),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// // ============================================
// // REGISTER ACTION
// // ============================================

// export async function registerUser(
//   prevState: RegisterState | undefined,
//   formData: FormData
// ): Promise<RegisterState> {
//   // ✅ Safe string extraction
//   const raw = {
//     name: getString(formData.get("name")),
//     email: getString(formData.get("email")),
//     phone: getString(formData.get("phone")),
//     location: getString(formData.get("location")),
//     password: getString(formData.get("password")),
//     confirmPassword: getString(formData.get("confirmPassword")),
//     role: getString(formData.get("role")) as "CUSTOMER" | "TECHNICIAN",
//   };

//   console.log("📝 Registration Data:", { ...raw, password: "******" });

//   const result = registerSchema.safeParse(raw);

//   if (!result.success) {
//     return {
//       success: false,
//       errors: result.error.issues.map((err) => ({
//         field: err.path[0]?.toString() || "",
//         message: err.message,
//       })),
//       data: raw,
//     };
//   }

//   const { name, email, phone, location, password, role } = result.data;

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, phone, location, password, role }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         errors: [
//           { field: "general", message: data.message || "Registration failed" },
//         ],
//         data: raw,
//       };
//     }

//     return {
//       success: true,
//       errors: [],
//       data: { name, email, phone, location, role },
//     };
//   } catch (error) {
//     console.error("Registration error:", error);
//     return {
//       success: false,
//       errors: [
//         {
//           field: "general",
//           message: "Something went wrong. Please try again.",
//         },
//       ],
//       data: raw,
//     };
//   }
// }


// app/(auth_group)/_auth_action/auth_action.ts

"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

// ============================================
// TYPES
// ============================================

export type LoginState = {
  success: boolean;
  statusCode?: number;
  message: string;  // ✅ string
  redirectTo?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export type RegisterState = {
  success: boolean;
  errors?: { field: string; message: string }[];
  data?: any;
};

// ============================================
// LOGIN ACTION
// ============================================

export const loginAction = async (
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> => {
  // ✅ FormData থেকে string
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    console.log("🔍 Sending Login Request:", { email });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await res.json();
    console.log("📦 Login Response:", JSON.stringify(result, null, 2));

    // ✅ result.success check
    if (!result.success) {
      return {
        success: false,
        message: String(result.message || "Invalid credentials"), // ✅ String()
      };
    }

    // ✅ Tokens safely
    const accessToken = result?.data?.accessToken || "";
    const refreshToken = result?.data?.refreshToken || "";

    if (!accessToken) {
      return {
        success: false,
        message: "No access token received from server",
      };
    }

    // ✅ Role
    let role = "CUSTOMER";
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload;
      if (decoded && typeof decoded === "object" && "role" in decoded) {
        role = String(decoded.role);
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }

    console.log("🎭 User Role:", role);

    // ✅ Redirect
    let redirectTo = "/";
    if (role === "ADMIN") {
      redirectTo = "/admin_dashboard";
    } else if (role === "TECHNICIAN") {
      redirectTo = "/technician_dashboard";
    } else {
      redirectTo = "/customer_dashboard";
    }

    return {
      success: true,
      message: String(result.message || "Login successful"), // ✅ String()
      redirectTo,
      data: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.", // ✅ error handle
    };
  }
};

// ============================================
// REGISTER SCHEMA
// ============================================

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  location: z.string().min(2, "Location is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============================================
// REGISTER ACTION
// ============================================

export async function registerUser(
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    location: formData.get("location")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    confirmPassword: formData.get("confirmPassword")?.toString() || "",
    role: (formData.get("role")?.toString() || "CUSTOMER") as "CUSTOMER" | "TECHNICIAN",
  };

  const result = registerSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((err) => ({
        field: err.path[0]?.toString() || "",
        message: err.message,
      })),
      data: raw,
    };
  }

  const { name, email, phone, location, password, role } = result.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, location, password, role }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: data.message || "Registration failed",
          },
        ],
        data: raw,
      };
    }

    return {
      success: true,
      errors: [],
      data: { name, email, phone, location, role },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      errors: [
        {
          field: "general",
          message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        },
      ],
      data: raw,
    };
  }
}
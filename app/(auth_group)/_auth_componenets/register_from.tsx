"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { RegisterState, registerUser } from "../_auth_action/auth_action"

const initialState: RegisterState = {
  success: false,
  errors: [],
  data: {}
}

// ✅ THIS IS THE COMPONENT - Function declaration
export default function RegisterForm() {
  const [role, setRole] = useState("customer")
  const [state, action, pending] = useActionState(registerUser, initialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success("Registration Successful! 🎉")
      setTimeout(() => {
        if (state?.data?.role === "CUSTOMER") {
          router.push("/user_dashboard")
        } else {
          router.push("/technician_dashboard")
        }
      }, 1500)
    }

    if (!state.success && state.errors?.length) {
      toast.error(state.errors[0].message || "Registration Failed")
    }
  }, [state, router])

  const getError = (field: string): string | null => {
    return state?.errors?.find((e) => e.field === field)?.message || null
  }

  const hasError = (field: string): boolean => {
    return !!state?.errors?.some((e) => e.field === field)
  }

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            defaultValue={state?.data?.name || ""}
            className={hasError("name") ? "border-red-500" : ""}
          />
          {hasError("name") && (
            <p className="text-red-500 text-sm">{getError("name")}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            defaultValue={state?.data?.email || ""}
            className={hasError("email") ? "border-red-500" : ""}
          />
          {hasError("email") && (
            <p className="text-red-500 text-sm">{getError("email")}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+880 1234567890"
            required
            defaultValue={state?.data?.phone || ""}
            className={hasError("phone") ? "border-red-500" : ""}
          />
          {hasError("phone") && (
            <p className="text-red-500 text-sm">{getError("phone")}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            placeholder="Dhaka, Bangladesh"
            required
            defaultValue={state?.data?.location || ""}
            className={hasError("location") ? "border-red-500" : ""}
          />
          {hasError("location") && (
            <p className="text-red-500 text-sm">{getError("location")}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min 8 chars"
            required
            className={hasError("password") ? "border-red-500" : ""}
          />
          {hasError("password") && (
            <p className="text-red-500 text-sm">{getError("password")}</p>
          )}
          <p className="text-xs text-gray-500">
            Min 8 chars with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password *</Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            required
            className={hasError("confirmPassword") ? "border-red-500" : ""}
          />
          {hasError("confirmPassword") && (
            <p className="text-red-500 text-sm">{getError("confirmPassword")}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>Register as *</Label>
          <RadioGroup
            defaultValue={state?.data?.role || "CUSTOMER"}
            onValueChange={setRole}
            name="role"
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CUSTOMER" id="CUSTOMER" />
              <Label htmlFor="CUSTOMER" className="cursor-pointer">
                Customer - Book Services
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="TECHNICIAN" id="TECHNICIAN" />
              <Label htmlFor="TECHNICIAN" className="cursor-pointer">
                Technician - Provide Services
              </Label>
            </div>
          </RadioGroup>
          {hasError("role") && (
            <p className="text-red-500 text-sm">{getError("role")}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </Card>
    </form>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginAction, LoginState } from "@/app/(auth_group)/_auth_action/auth_action"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { any } from "zod"

const initialState: LoginState = {
  success: false,
  message: "",
  redirectTo: "",
}

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, initialState as any)

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message || "Login Successful")

      // ✅ Set cookies manually
      if (state.data?.accessToken) {
        document.cookie = `accessToken=${state.data.accessToken}; path=/; max-age=3600; SameSite=Lax`
        console.log("✅ AccessToken cookie set:", state.data.accessToken)
      }
      if (state.data?.refreshToken) {
        document.cookie = `refreshToken=${state.data.refreshToken}; path=/; max-age=18000; SameSite=Lax`
        console.log("✅ RefreshToken cookie set:", state.data.refreshToken)
      }

      // ✅ Redirect
      if (state.redirectTo) {
        setTimeout(() => {
          window.location.href = state.redirectTo
        }, 500)
      }
    }

    if (!state.success && state.message) {
      toast.error(state.message || "Login Failed")
    }
  }, [state])

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <Input name="email" type="email" placeholder="Enter your Email" required />
        <Input name="password" type="password" placeholder="Enter your password" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting....." : "Login"}
        </Button>
      </Card>
    </form>
  )
}

export default LoginForm
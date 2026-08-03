// app/(auth_group)/_auth_components_folder/login_form.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction, LoginState } from "../_auth_action/auth_action";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState: LoginState = {
    success: false,
    statusCode: 0,
    message: "",
};

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginAction, initialState);

    useEffect(() => {
        if (!state) return;

        console.log("🔔 Login State:", state);

        if (state.success) {
            toast.success(state.message || "Login Successful");
            // ✅ Redirect handled by server (redirect() function)
            // No need for client-side redirect
        }

        if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={action} className="space-y-4">
            <Card className="p-5 space-y-4">
                <Input
                    name="email"
                    type="email"
                    placeholder="Enter your Email"
                    required
                    disabled={pending}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    disabled={pending}
                />
                <Button type="submit" disabled={pending} className="w-full">
                    {pending ? "Submitting....." : "Login"}
                </Button>
            </Card>
        </form>
    );
};

export default LoginForm;
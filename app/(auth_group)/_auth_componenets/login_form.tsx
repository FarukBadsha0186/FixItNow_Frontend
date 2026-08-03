// // // "use client"

// // // import { Button } from "@/components/ui/button"
// // // import { Card } from "@/components/ui/card"
// // // import { Input } from "@/components/ui/input"
// // // import { Form } from "radix-ui/form"
// // // import { loginAction } from "../_auth_action/auth_action"
// // // import { useActionState, useEffect } from "react"
// // // import { toast } from "sonner"
// // // import { useRouter } from "next/navigation"

// // // const LoginForm =()=>{
// // //     const [state, action ,pending]= useActionState(loginAction, false)
// // //   //  const router=useRouter();
// // //     useEffect(()=>{
// // //         if(!state) return;
// // //       if (state.success) {
// // //           toast.success(state.message ||"Login Successful" )
    
        
// // //       }
// // //       if(!state.success){
// // //           toast.error(state.message || "Login Failed")

// // //       }

// // //     }), [state];

// // //     return (
// // //        <form action={action}  className="space-y-4">
// // //         <Card className="p-5 space-y-4">
// // //             <Input name="email" type="email" placeholder="Enter your Email" required />
// // //             <Input name="password" type="password" placeholder="Enter your password" required />
// // //             <Button type="submit">
// // //                 {
// // //                     pending ? "Submitting....."  :"Login" 
// // //                 }
// // //             </Button>
// // //         </Card>
// // //        </form>
// // //     )
// // // }

// // //  export default LoginForm

// // "use client"

// // import { Button } from "@/components/ui/button"
// // import { Card } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { loginAction } from "@/app/(auth_group)/_auth_action/auth_action"
// // import { useActionState, useEffect } from "react"
// // import { toast } from "sonner"
// // import { useRouter } from "next/navigation"

// // // ✅ Define proper LoginState type
// // type LoginState = {
// //   success: boolean
// //   message?: string
// //   statusCode?: number
// //   data?: {
// //     accessToken?: string
// //     refreshToken?: string
// //   }
// // }

// // // ✅ Correct initialState
// // const initialState: LoginState = {
// //   success: false,
// //   message? :String
// // }

// // const LoginForm = () => {
// //   const [state, action, pending] = useActionState(loginAction, initialState)
// //   const router = useRouter()

// //   useEffect(() => {
// //     if (!state) return

// //     if (state.success) {
// //       toast.success(state.message || "Login Successful")
// //     }

// //     if (!state.success && state.message) {
// //       toast.error(state.message || "Login Failed")
// //     }
// //   }, [state])

// //   return (
// //     <form action={action} className="space-y-4">
// //       <Card className="p-5 space-y-4">
// //         <Input 
// //           name="email" 
// //           type="email" 
// //           placeholder="Enter your Email" 
// //           required 
// //         />
// //         <Input 
// //           name="password" 
// //           type="password" 
// //           placeholder="Enter your password" 
// //           required 
// //         />
// //         <Button type="submit" disabled={pending}>
// //           {pending ? "Submitting....." : "Login"}
// //         </Button>
// //       </Card>
// //     </form>
// //   )
// // }

// // export default LoginForm


// "use client"

// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { loginAction } from "@/app/(auth_group)/_auth_action/auth_action"
// import { useActionState, useEffect } from "react"
// import { toast } from "sonner"
// import { useRouter } from "next/navigation"

// // ✅ Define proper LoginState type
// type LoginState = {
//   success: boolean
//   message?: string  // ✅ Optional property er syntax eta
//   statusCode?: number
//   data?: {
//     accessToken?: string
//     refreshToken?: string
//   }
// }

// // ✅ Correct initialState
// const initialState: LoginState = {
//   success: false,
//   message: "", 
// }

// const LoginForm = () => {
//   const [state, action, pending] = useActionState(loginAction, initialState)
//   const router = useRouter()

//   useEffect(() => {
//     if (!state) return

//     if (state.success) {
//       toast.success(state.message || "Login Successful")
//     }

//     if (!state.success && state.message) {
//       toast.error(state.message || "Login Failed")
//     }
//   }, [state])

//   return (
//     <form action={action} className="space-y-4">
//       <Card className="p-5 space-y-4">
//         <Input 
//           name="email" 
//           type="email" 
//           placeholder="Enter your Email" 
//           required 
//         />
//         <Input 
//           name="password" 
//           type="password" 
//           placeholder="Enter your password" 
//           required 
//         />
//         <Button type="submit" disabled={pending}>
//           {pending ? "Submitting....." : "Login"}
//         </Button>
//       </Card>
//     </form>
//   )
// }

// export default LoginForm


"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/app/(auth_group)/_auth_action/auth_action"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// ✅ LoginState type (message required)
type LoginState = {
  success: boolean
  message: string   
  statusCode?: number
  data?: {
    accessToken?: string
    refreshToken?: string
  }
}

// ✅ initialState must have message
const initialState: LoginState = {
  success: false,
  message: "",
}

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, initialState)
  const router = useRouter()

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message || "Login Successful")
    }

    if (!state.success && state.message) {
      toast.error(state.message || "Login Failed")
    }
  }, [state])

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4">
        <Input 
          name="email" 
          type="email" 
          placeholder="Enter your Email" 
          required 
        />
        <Input 
          name="password" 
          type="password" 
          placeholder="Enter your password" 
          required 
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting....." : "Login"}
        </Button>
      </Card>
    </form>
  )
}

export default LoginForm
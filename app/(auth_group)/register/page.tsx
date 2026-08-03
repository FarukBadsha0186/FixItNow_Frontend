import RegisterForm from "../_auth_componenets/register_from";



export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        < RegisterForm/>
      </div>
    </div>
  )
}
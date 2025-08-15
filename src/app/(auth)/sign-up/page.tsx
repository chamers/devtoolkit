"use client"
import AuthForm from "@/components/AuthForm"
import { signUpSchema } from "@/lib/validations"

const page = () => {
  return (
    <AuthForm type="SIGN_UP" schema={signUpSchema} defaultValues={{userName: "", email: "", password: ""  }} onSubmit={() => {}} />
  )
}
export default page
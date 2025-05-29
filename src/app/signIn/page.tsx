import { auth } from "@/lib/auth"
import SigninPage from "@/app/signIn/components/SignInPage"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
export default async function SignIn() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session) {
    redirect("/dashboard")
  }
  return (
    <div>
      <SigninPage />
    </div>
  )
}
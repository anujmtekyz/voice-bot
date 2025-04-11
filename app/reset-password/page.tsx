import { Suspense } from "react"
import { ResetPasswordPage } from "@/components/auth/reset-password-page"

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}

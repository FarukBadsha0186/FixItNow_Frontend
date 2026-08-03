import { Suspense } from 'react'
import PaymentCancelContent from './PaymentCancelContent'

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  )
}
import { useState } from 'react'
import { Card } from '@/components/shared/Card'

type PaymentStatus = 'idle' | 'processing' | 'success'

const steps = [
  {
    id: 'init',
    title: 'Processing',
    description: 'Dispatching payment request to Nova Payments service',
  },
  {
    id: 'success',
    title: 'Success',
    description: 'Payment confirmed — ready to emit Kafka event',
  },
]

export const PaymentPage = () => {
  const [status, setStatus] = useState<PaymentStatus>('idle')

  const handleSimulate = async () => {
    setStatus('processing')
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('success')
  }

  return (
    <div className="space-y-6">
      <Card
        title="Payment simulation"
        description="Trigger a mock payment lifecycle to validate UI flows"
        actions={
          <button
            type="button"
            onClick={handleSimulate}
            disabled={status === 'processing'}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {status === 'processing' ? 'Processing…' : 'Simulate payment'}
          </button>
        }
      >
        <ul className="space-y-3">
          {steps.map((step, index) => {
            const isComplete =
              status === 'success' || (status === 'processing' && index === 0)
            const isActive =
              (status === 'processing' && index === 0) ||
              (status === 'success' && index === steps.length - 1)

            return (
              <li
                key={step.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  isActive
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span
                  className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isComplete
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                  {step.id === 'success' && status === 'success' ? (
                    <p className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Payment successful ✅
                    </p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card
        title="Kafka integration (optional)"
        description="Future enhancement for emitting payment confirmation events"
      >
        <p className="text-sm text-slate-500">
          When Kafka integration becomes available, NovaUI can publish a
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">payment.success</code>
          event containing order, user, and product metadata. Use this section to
          display the connection status to the message broker and surface any
          delivery errors.
        </p>
      </Card>
    </div>
  )
}

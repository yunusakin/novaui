export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(value)

export const formatDate = (value: string | number | Date) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(typeof value === 'string' ? new Date(value) : value)

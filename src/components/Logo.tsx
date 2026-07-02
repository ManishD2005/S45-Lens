import { Link } from 'react-router-dom'

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="flex shrink-0 items-center">
      <img src="/S45lens-logo.svg" alt="S45 Lens" className="h-6 w-auto sm:h-7" />
    </Link>
  )
}

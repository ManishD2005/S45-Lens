import { Link } from 'react-router-dom'

export function Logo({ to = '/', variant = 'light' }: { to?: string; variant?: 'light' | 'dark' }) {
  const src = variant === 'dark' ? '/S45lens-logo-dark.svg' : '/S45lens-logo.svg'
  return (
    <Link to={to} className="flex shrink-0 items-center">
      <img src={src} alt="S45 Lens" className="h-6 w-auto sm:h-7" />
    </Link>
  )
}

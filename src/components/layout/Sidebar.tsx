import { NavLink } from 'react-router-dom'
import { navigationItems } from '@/constants/navigation'

export const Sidebar = () => (
  <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white pb-8 md:flex md:flex-col">
    <div className="px-6 pb-6 pt-5">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
          N
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">NovaUI</p>
          <p className="text-xs text-slate-500">Operations console</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 space-y-1 px-4">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
              isActive
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

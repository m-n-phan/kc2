import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useUserContext } from '../hooks/useUserContext'
import { cn } from '../utils/cn'

export interface ContextButtonProps {
  className?: string
}

const locations = ['Limegreen', 'Riverside']

export const ContextButton: React.FC<ContextButtonProps> = ({ className }) => {
  const { location, role, setLocation } = useUserContext()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation)
    setOpen(false)
  }



  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-label={`Current context: ${location} – ${role}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-1 text-sm font-medium',
          'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-orange',
          'px-3 py-2 rounded min-w-touch min-h-touch',
          className
        )}
      >
        {/* Desktop: Full text */}
        <span className="hidden lg:inline" title={`${location} – ${role}`}>
          {location} – {role}
        </span>
        {/* Tablet: Location only */}
        <span className="hidden md:inline lg:hidden" title={`${location} – ${role}`}>
          {location}
        </span>
        {/* Mobile: Abbreviated */}
        <span className="md:hidden" title={`${location} – ${role}`}>
          {location.slice(0, 1)}{role.slice(0, 1)}
        </span>
        <ChevronDown 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            open ? 'rotate-180' : ''
          )} 
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            'absolute top-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50',
            // Mobile: full width with some margin, Desktop: fixed width positioned left
            'left-0 right-4 md:left-0 md:right-auto md:w-48'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Locations Section */}
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Locations
          </div>
          {locations.map((loc) => (
            <button
              key={loc}
              role="menuitemradio"
              aria-checked={location === loc}
              onClick={() => handleLocationSelect(loc)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm',
                'hover:bg-slate-50 focus:outline-none focus:bg-slate-50',
                location === loc ? 'text-brand-orange font-medium' : 'text-slate-700'
              )}
            >
              <span>{loc}</span>
              {location === loc && <Check className="w-4 h-4" />}
            </button>
          ))}

          {/* Admin-only section (Manager role only) */}
          {role === 'Manager' && (
            <>
              <div className="my-1 border-t border-slate-200" />
              <button
                className="w-full px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 focus:outline-none focus:bg-slate-50 text-left"
                onClick={() => setOpen(false)}
              >
                Manage Locations…
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
} 
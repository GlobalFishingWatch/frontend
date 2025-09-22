import { Logo } from '@globalfishingwatch/ui-components'

function Header({ children }: { children?: React.ReactNode }) {
  return (
    <div className="!bg-white z-5">
      <div className="flex gap-4 items-center !px-[var(--space-S)] ![border-bottom:var(--border)] h-[var(--header-height)]">
        <a href="https://globalfishingwatch.org" className="mr-auto leading-[0]">
          <Logo className="w-2xs h-auto" />
        </a>
        {children}
      </div>
    </div>
  )
}

export default Header

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { SignInButton, UserButton, useAuth } from "@clerk/react"
import { Trans } from "@lingui/react/macro"
import { Moon, Sun, Menu, X, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useCurrentUser } from "@/hooks/use-current-user"
import { activateLocale, locales, type Locale } from "@/lib/i18n"
import { useLingui } from "@lingui/react"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-8"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

function LanguageToggle() {
  const { i18n } = useLingui()
  const currentLocale = i18n.locale as Locale
  const nextLocale: Locale = currentLocale === "en" ? "ar" : "en"
  const shortLabel = nextLocale === "ar" ? "AR" : "EN"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => activateLocale(nextLocale)}
      className="size-8 gap-1"
      title={locales[nextLocale]}
    >
      <Languages className="size-4" />
      <span className="text-[10px] font-medium leading-none">{shortLabel}</span>
    </Button>
  )
}

export function Navbar() {
  const { isSignedIn } = useAuth()
  const { data: currentUser } = useCurrentUser()
  const isAdmin = currentUser?.isAdmin ?? false
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { to: "/projects" as const, label: <Trans>Browse</Trans> },
    { to: "/leaderboard" as const, label: <Trans>Honor Board</Trans> },
    ...(isSignedIn
      ? [{ to: "/submit" as const, label: <Trans>Submit Idea</Trans> }]
      : []),
    ...(isAdmin
      ? [{ to: "/admin" as const, label: <Trans>Admin</Trans> }]
      : []),
  ]

  return (
    <header className="border-b-2 border-primary/20">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-primary font-bold text-xl"
          onClick={() => setMobileOpen(false)}
        >
          <Trans>Takatuf</Trans>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageToggle />
          <ThemeToggle />
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors">
                <Trans>Sign In</Trans>
              </button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageToggle />
          <ThemeToggle />
          {isSignedIn && <UserButton />}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Trans>Sign In</Trans>
                </button>
              </SignInButton>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

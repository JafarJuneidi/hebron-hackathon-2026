import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Navbar } from "@/components/navbar"
import { AuthInit } from "@/components/auth-init"
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AuthInit />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p><Trans>Takatuf — Connecting communities through volunteering</Trans></p>
          <p><Trans>Built with love in Hebron</Trans></p>
        </div>
      </footer>
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  )
}

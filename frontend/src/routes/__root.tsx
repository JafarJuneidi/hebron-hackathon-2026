import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Navbar } from "@/components/navbar"
import { AuthInit } from "@/components/auth-init"
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-svh">
      <AuthInit />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  )
}

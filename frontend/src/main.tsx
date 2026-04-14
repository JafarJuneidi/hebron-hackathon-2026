import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider } from "@clerk/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { activateLocale, getStoredLocale } from "@/lib/i18n"
import { routeTree } from "./routeTree.gen"

import "./index.css"

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in environment")
}

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Activate stored locale before rendering
await activateLocale(getStoredLocale())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </I18nProvider>
  </StrictMode>
)

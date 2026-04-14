import { i18n } from "@lingui/core"

export const locales = {
  en: "English",
  ar: "العربية",
} as const

export type Locale = keyof typeof locales
export const defaultLocale: Locale = "en"

const STORAGE_KEY = "locale"

export function getStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in locales) return stored as Locale
  return defaultLocale
}

export async function activateLocale(locale: Locale) {
  const { messages } = await import(`../locales/${locale}/messages.po`)
  i18n.load(locale, messages)
  i18n.activate(locale)
  localStorage.setItem(STORAGE_KEY, locale)

  // Set HTML dir and lang attributes for RTL/LTR
  document.documentElement.lang = locale
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
}

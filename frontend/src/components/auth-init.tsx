import { useEffect } from "react"
import { useAuth } from "@clerk/react"
import { setTokenGetter } from "@/lib/api"

export function AuthInit() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(getToken)
  }, [getToken])

  return null
}

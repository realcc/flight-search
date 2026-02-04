import axios from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants'
import type { AmadeusAuthResponse } from '../types'

interface TokenData {
  accessToken: string
  expiresAt: number
}

let tokenData: TokenData | null = null
let tokenPromise: Promise<string> | null = null

function getStoredToken(): TokenData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (stored) {
      const parsed = JSON.parse(stored) as TokenData
      if (parsed.expiresAt > Date.now()) {
        return parsed
      }
    }
  } catch {
    // Ignore storage errors
  }
  return null
}

function storeToken(data: TokenData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

function clearToken(): void {
  tokenData = null
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch {
    // Ignore storage errors
  }
}

async function fetchNewToken(): Promise<string> {
  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus API credentials not configured')
  }

  const response = await axios.post<AmadeusAuthResponse>(
    `${API_BASE_URL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  const { access_token, expires_in } = response.data
  const expiresAt = Date.now() + (expires_in - 60) * 1000

  tokenData = { accessToken: access_token, expiresAt }
  storeToken(tokenData)

  return access_token
}

export async function getAccessToken(): Promise<string> {
  if (tokenData && tokenData.expiresAt > Date.now()) {
    return tokenData.accessToken
  }

  const storedToken = getStoredToken()
  if (storedToken) {
    tokenData = storedToken
    return storedToken.accessToken
  }

  if (tokenPromise) {
    return tokenPromise
  }

  tokenPromise = fetchNewToken().finally(() => {
    tokenPromise = null
  })

  return tokenPromise
}

export function invalidateToken(): void {
  clearToken()
}

export function isTokenValid(): boolean {
  if (tokenData && tokenData.expiresAt > Date.now()) {
    return true
  }
  const storedToken = getStoredToken()
  return storedToken !== null
}

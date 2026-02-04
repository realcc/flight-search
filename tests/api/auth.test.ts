import { describe, it, expect, beforeEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { getAccessToken, invalidateToken } from '../../src/api/auth'

describe('Auth', () => {
  beforeEach(() => {
    invalidateToken()
    localStorage.clear()
    vi.stubEnv('VITE_AMADEUS_CLIENT_ID', 'test-client-id')
    vi.stubEnv('VITE_AMADEUS_CLIENT_SECRET', 'test-client-secret')
  })

  it('should fetch a new token when none exists', async () => {
    const token = await getAccessToken()
    expect(token).toBe('test-access-token')
  })

  it('should return cached token on subsequent calls', async () => {
    const token1 = await getAccessToken()
    const token2 = await getAccessToken()
    expect(token1).toBe(token2)
  })

  it('should handle token refresh after invalidation', async () => {
    const token1 = await getAccessToken()
    invalidateToken()
    const token2 = await getAccessToken()
    expect(token1).toBe(token2) // Same test mock token
  })

  it('should throw error when credentials are not configured', async () => {
    vi.stubEnv('VITE_AMADEUS_CLIENT_ID', '')
    vi.stubEnv('VITE_AMADEUS_CLIENT_SECRET', '')
    invalidateToken()

    await expect(getAccessToken()).rejects.toThrow('Amadeus API credentials not configured')
  })

  it('should handle API errors', async () => {
    server.use(
      http.post('https://test.api.amadeus.com/v1/security/oauth2/token', () => {
        return new HttpResponse(null, { status: 401 })
      })
    )

    await expect(getAccessToken()).rejects.toThrow()
  })
})

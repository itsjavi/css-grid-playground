import clsx, { ClassValue } from 'clsx'

export function cn(...args: ClassValue[]): string {
  return clsx(...args)
}

export function base64Encode(str: string): string {
  if (typeof Buffer === 'undefined') {
    return btoa(str)
  }
  return Buffer.from(str).toString('base64')
}

export function base64Decode(str: string): string {
  if (typeof Buffer === 'undefined') {
    return atob(str)
  }
  return Buffer.from(str, 'base64').toString()
}

export function urlSafeBase64Encode(str: string): string {
  return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_')
}

export function urlSafeBase64Decode(str: string): string {
  return base64Decode(str.replace(/-/g, '+').replace(/_/g, '/'))
}

export function decodeLocationHash(): string | undefined {
  const hash = window.location.hash.slice(1)
  if (!hash) {
    return undefined
  }

  return urlSafeBase64Decode(hash)
}

export function pushEncodedLocationHash(value: string): string {
  const newHash = urlSafeBase64Encode(value)
  window.location.hash = newHash
  return newHash
}

export function replaceEncodedLocationHash(value: string): string {
  const newHash = urlSafeBase64Encode(value)
  history.replaceState(undefined, '', `#${newHash}`)

  return newHash
}

export function safelyJoinCss(...args: (string | null | undefined)[]): string {
  return args
    .map((value: string | null | undefined): string | undefined => {
      if (!value) {
        return
      }
      return value.trim().replace(/;$/, '')
    })
    .filter(Boolean)
    .join('; ')
}

import clsx, { ClassValue } from 'clsx'

export function cn(...args: ClassValue[]): string {
  return clsx(...args)
}

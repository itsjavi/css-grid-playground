import { StateCreator, create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { debouncedLocalStorageWithHistory } from './debouncedStorage'

export default function createPersistentStore<T>(
  creator: StateCreator<T, [['zustand/devtools', never], ['zustand/persist', unknown]], []>,
  name = 'playground-store',
) {
  return create<T, [['zustand/devtools', T], ['zustand/persist', T]]>(
    devtools(
      persist(creator, {
        name,
        storage: createJSONStorage(() => debouncedLocalStorageWithHistory),
      }),
      {
        name,
        enabled: process.env.NODE_ENV === 'development',
      },
    ),
  )
}

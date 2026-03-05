import { create } from 'zustand'
import type { AuthSlice } from './slices/authSlice'
import { createAuthSlice } from './slices/authSlice'
import type { IssueSlice } from './slices/issueSlice'
import { createIssueSlice } from './slices/issueSlice'

export type StoreState = {
  auth: AuthSlice
  issue: IssueSlice
}

export const useStore = create<StoreState>((set, get) => ({
  auth: createAuthSlice(
    (partial) =>
      set((state) => ({
        auth:
          typeof partial === 'function'
            ? { ...state.auth, ...partial(state.auth) }
            : { ...state.auth, ...partial },
      })),
    () => get().auth
  ),
  issue: createIssueSlice(
    (partial) =>
      set((state) => ({
        issue:
          typeof partial === 'function'
            ? { ...state.issue, ...partial(state.issue) }
            : { ...state.issue, ...partial },
      })),
    () => get().issue
  ),
}))

export const useAuthStore = <T>(selector: (state: AuthSlice) => T): T =>
  useStore((state) => selector(state.auth))

export const useIssueStore = <T>(selector: (state: IssueSlice) => T): T =>
  useStore((state) => selector(state.issue))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAccount {
  id: string; // usually email
  email: string;
  password?: string;
  name?: string;
  money?: number;
  coins?: number;
  lastChecked?: number;
}

interface MultiAccountState {
  accounts: SavedAccount[];
  selectedAccountIds: string[];
  addAccount: (account: SavedAccount) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<SavedAccount>) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  clearAccounts: () => void;
}

export const useMultiAccount = create<MultiAccountState>()(
  persist(
    (set) => ({
      accounts: [],
      selectedAccountIds: [],
      addAccount: (account) => set((state) => {
        const exists = state.accounts.some(a => a.id === account.id);
        if (exists) {
          return { accounts: state.accounts.map(a => a.id === account.id ? { ...a, ...account } : a) };
        }
        return { accounts: [...state.accounts, account] };
      }),
      removeAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id),
        selectedAccountIds: state.selectedAccountIds.filter(selId => selId !== id)
      })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      toggleSelection: (id) => set((state) => ({
        selectedAccountIds: state.selectedAccountIds.includes(id) 
          ? state.selectedAccountIds.filter(selId => selId !== id)
          : [...state.selectedAccountIds, id]
      })),
      selectAll: () => set((state) => ({
        selectedAccountIds: state.accounts.map(a => a.id)
      })),
      deselectAll: () => set({ selectedAccountIds: [] }),
      clearAccounts: () => set({ accounts: [], selectedAccountIds: [] })
    }),
    {
      name: 'multi-account-storage'
    }
  )
);

import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type PersistOptions<T> = {
  name: string;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: unknown, version: number) => T;
};

type Persist = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => StateCreator<T, Mps, Mcs>;

function isFunction<T>(value: unknown): value is () => T {
  return typeof value === "function";
}

export function createJSONStorage<T>() {
  return {
    getItem: (name: string): T | null => {
      if (typeof window === "undefined") return null;
      try {
        const item = window.localStorage.getItem(name);
        return item ? (JSON.parse(item) as T) : null;
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: T) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(name, JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
    removeItem: (name: string) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}

export const persist =
  (storage: ReturnType<typeof createJSONStorage>) =>
  <T,>(
    initializer: StateCreator<T>,
    options: PersistOptions<T>
  ): StateCreator<T> =>
  (set, get, api) => {
    const { name, partialize, version = 0, migrate } = options;

    type PersistedData = { state: Partial<T>; version: number };

    const initialize = () => {
      const persisted = storage.getItem(name) as PersistedData | null;
      if (persisted) {
        if (persisted.version !== version) {
          if (migrate) {
            const migrated = migrate(persisted.state, persisted.version);
            Object.entries(migrated).forEach(([k, v]) => {
              set({ [k]: v } as Partial<T>);
            });
          }
          storage.removeItem(name);
        } else {
          Object.entries(persisted.state).forEach(([k, v]) => {
            set({ [k]: v } as Partial<T>);
          });
        }
      }
    };

    setTimeout(initialize, 0);

    let timeoutId: ReturnType<typeof setTimeout>;
    const saveState = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const state = get();
        const partial = partialize ? partialize(state) : state;
        storage.setItem(name, { state: partial, version } as PersistedData);
      }, 100);
    };

    const originalSet = set;
    const wrappedSet = (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean
    ) => {
      originalSet(partial as any, replace as any);
      saveState();
    };

    return initializer(wrappedSet, get, api);
  };

export const appStorage = createJSONStorage();
export const withPersist = persist(appStorage);

import { merge } from "lodash";
import { createContext, useCallback, useContext, useRef, useSyncExternalStore } from "react";

const notInitValue = Symbol("NOT_INIT");

type CallBack = () => void;
type FastContextInterface<TStore> = {
  get: () => TStore;
  set: (value: Partial<TStore>) => void;
  subscribe: (callback: CallBack) => () => void;
};

class FastContext<TStore> {
  context: React.Context<FastContextInterface<TStore> | typeof notInitValue>;
  defaultValue: TStore;

  constructor(defaultValue: TStore) {
    this.defaultValue = defaultValue;
    this.context = createContext<FastContextInterface<TStore> | typeof notInitValue>(notInitValue);
  }

}

export function createFastContext<TStore>(defaultValue: TStore): FastContext<TStore> {
  return new FastContext<TStore>(defaultValue);
}

export function FastContextProvider<TStore>({ children, fastContext, value }: { children: React.ReactNode; fastContext: FastContext<TStore>, value: TStore }) {
  const valueRef = useRef(value);

  const subscribersRef = useRef(new Set<CallBack>());

  const get = useCallback(() => valueRef.current, []);
  const set = useCallback((value: Partial<TStore>) => {
    const store = valueRef.current;
    // depending on if the store and value are objects, we either merge or replace
    if (typeof store === "object" && typeof value === "object") {
      merge(valueRef.current, value);
    } else {
      valueRef.current = value as TStore;
    }
    subscribersRef.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: CallBack) => {
    subscribersRef.current.add(callback);
    return () => subscribersRef.current.delete(callback);
  }, []);

  return <fastContext.context.Provider value={{
    get,
    set,
    subscribe
  }}>{children}</fastContext.context.Provider>;
}

export function useFastContext<TStore, TSelectorValue>(fastContext: FastContext<TStore>, selector: (store: TStore) => TSelectorValue): [TSelectorValue, (value: Partial<TStore>) => void] {
  const context = useContext(fastContext.context);
  if (context === notInitValue) {
    throw new Error("useFastContext must be used within a FastContextProvider.");
  }

  const state = useSyncExternalStore(context.subscribe, () => selector(context.get()), () => selector(fastContext.defaultValue));
  return [state, context.set];
}
import { ReactiveMap } from "@solid-primitives/map";
import { createTimer } from "@solid-primitives/timer";
import { createComputed, createContext, createSignal, useContext, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import server$ from "solid-start/server";
import { addSample as _addSample } from "~/server/addSample";

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export interface Person {
  name: string;
  similarity: number;
}

interface DataStoreContextProps {
  input: {
    text: string;
    typed: string[];
    hasTyped: boolean;
    active: boolean;
    timeLeft: number;
    startTimer(length?: number): void;
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
    restart(time?: number): void;
  };
  data: {
    samples: [string, number, number];
  };
  compare: {
    persons: Person[];
  };
}

const DataStoreContext = createContext<DataStoreContextProps>();

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within a DataStoreProvider");
  return ctx;
};

export function DataStoreProvider(props: ParentProps) {
  const addSample$ = server$(_addSample);

  const loaders = new ReactiveMap<string, boolean>();

  const pendingKeys = new Map<string, Date>();

  const [startTime, resetStartTime] = createSignal(new Date().getTime());

  const [dataStore, updateDataStore] = createStore<DataStoreContextProps>({
    input: {
      text: "",
      typed: [],
      hasTyped: false,
      active: false,
      timeLeft: 0,
      startTimer(length?: number) {
        updateDataStore("input", "timeLeft", length ?? 10);
        resetStartTime(new Date().getTime());
      },
      keyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
          e.preventDefault();
          dataStore.input.restart(2);
          return;
        }
        if (!dataStore.input.active) return;
        if (e.key === "Backspace") {
          addValidKey(e);
          updateDataStore("input", "typed", (prev) => prev.slice(0, -1));
        } else if (validLetter(e)) {
          addValidKey(e);
          updateDataStore("input", "typed", dataStore.input.typed.length, e.key);
          updateDataStore("input", "hasTyped", true);
        }
      },
      keyUp(e: KeyboardEvent) {
        if (!dataStore.input.active) return;
        const pending = pendingKeys.get(e.key);
        if (!pending) return;
        const time = startTime() - pending.getTime();
        console.log("UP:", e.key, new Date().getTime() - startTime());
        // updateDataStore("data", "samples", [...[e.key, 0, new Date().getTime() - startTime()]])
        pendingKeys.delete(e.key);
      },
      restart(time: number = 10) {
        updateDataStore("input", "text", loremIpsum);
        updateDataStore("input", "typed", []);
        updateDataStore("input", "hasTyped", false);
        updateDataStore("input", "active", true);
        dataStore.input.startTimer(time);
      },
    },
    compare: {
      persons: [],
    },
    data: {
      samples: ["", 0, 0],
    },
  });

  function validLetter(e: KeyboardEvent) {
    return e.key.length === 1 && e.metaKey === false && e.ctrlKey === false && e.altKey === false;
  }

  function addValidKey(e: KeyboardEvent) {
    e.preventDefault();
    console.log("DOWN:", e.key, new Date().getTime() - startTime());
    pendingKeys.set(e.key, new Date());
  }

  // set active based on whether there is time left
  createComputed(() => {
    const active = dataStore.input.timeLeft > 0;
    if (active !== dataStore.input.active) updateDataStore("input", "active", active);
  });

  createTimer(
    () => {
      updateDataStore("input", "timeLeft", dataStore.input.timeLeft - 1);
    },
    () => dataStore.input.active && dataStore.input.hasTyped && 1000,
    setInterval,
  );

  return <DataStoreContext.Provider value={dataStore}>{props.children}</DataStoreContext.Provider>;
}

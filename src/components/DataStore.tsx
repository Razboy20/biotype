import { createTimer } from "@solid-primitives/timer";
import { nanoid } from "nanoid";
import { createComputed, createContext, createEffect, createSignal, on, useContext, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import server$ from "solid-start/server";
import { addSample as _addSample } from "~/server/addSample";
import { authenticate as _authenticate } from "~/server/authenticate";
import { updateActiveSamples as _updateActiveSamples } from "~/server/updateActiveSamples";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export interface Person {
  name: string;
  similarity: number;
}

const timeAlotted = 35;

interface DataStoreContextProps {
  input: {
    text: string;
    typed: string[];
    wpm: number;
    hasTyped: boolean;
    active: boolean;
    timeLeft: number;
    startTimer(length?: number): void;
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
    restart(time?: number): void;
  };
  data: {
    testId: string;
    samples: [string, number, number][];
    name: string;
    setName(name: string): void;
  };
  compare: {
    persons: Person[];
    authPerson?: string;
  };
  sendResults(): void;
}

const DataStoreContext = createContext<DataStoreContextProps>();

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within a DataStoreProvider");
  return ctx;
};

export function DataStoreProvider(props: ParentProps) {
  const updateActiveSamples$ = server$(_updateActiveSamples);
  const addSample$ = server$(_addSample);
  const authenticate$ = server$(_authenticate);

  const pendingKeys = new Map<string, number>();

  const [startTime, resetStartTime] = createSignal(performance.now());

  const [dataStore, updateDataStore] = createStore<DataStoreContextProps>({
    input: {
      text: "",
      typed: [],
      wpm: 0,
      hasTyped: false,
      active: false,
      timeLeft: 0,
      startTimer(length?: number) {
        updateDataStore("input", "timeLeft", length ?? timeAlotted);
      },
      keyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
          e.preventDefault();
          dataStore.input.restart(timeAlotted);
          return;
        }
        if (!dataStore.input.active) return;
        if (e.key === "Backspace") {
          addValidKey(e);
          updateDataStore("input", "typed", (prev) => prev.slice(0, -1));
        } else if (validLetter(e)) {
          if (!dataStore.input.hasTyped) {
            updateDataStore("input", "hasTyped", true);
            resetStartTime(performance.now());
          }

          addValidKey(e);
          updateDataStore("input", "typed", dataStore.input.typed.length, e.key);
        }
      },
      keyUp(e: KeyboardEvent) {
        if (!dataStore.input.active) return;
        const pending = pendingKeys.get(e.key);
        if (!pending) return;
        const keyDownTime = pending - startTime();
        updateDataStore("data", "samples", dataStore.data.samples.length, [
          e.key,
          keyDownTime,
          performance.now() - startTime(),
        ]);
        pendingKeys.delete(e.key);
      },
      restart(time: number = timeAlotted) {
        updateDataStore("input", "text", loremIpsum);
        updateDataStore("input", "typed", []);
        updateDataStore("input", "hasTyped", false);
        updateDataStore("input", "active", true);
        updateDataStore("input", "wpm", 0);
        updateDataStore("data", "testId", nanoid());
        updateDataStore("data", "samples", []);
        dataStore.input.startTimer(time);
      },
    },
    compare: {
      persons: [],
    },
    data: {
      testId: "DEFAULT",
      samples: [],
      name: "",
      setName(name) {
        updateDataStore("data", "name", name);
      },
    },
    sendResults() {
      void addSample$(dataStore.data.testId, dataStore.data.name);
    },
  });

  async function sendSamples() {
    if (dataStore.data.samples.length === 0) return;
    const samples = dataStore.data.samples;
    updateDataStore("data", "samples", []);
    const res = await updateActiveSamples$(samples, dataStore.data.testId);
    // convert to Person[]
    let newRanks = res.map(([name, similarity]) => ({ name, similarity }) as Person);
    newRanks = newRanks.sort((a, b) => b.similarity - a.similarity);
    updateDataStore("compare", "persons", newRanks);
  }

  function validLetter(e: KeyboardEvent) {
    return e.key.length === 1 && e.metaKey === false && e.ctrlKey === false && e.altKey === false;
  }

  function addValidKey(e: KeyboardEvent) {
    e.preventDefault();
    pendingKeys.set(e.key, performance.now());
  }

  function updateWPM() {
    const typed = dataStore.input.typed;
    const time = performance.now() - startTime();
    const wpm = typed.length / 5 / (time / 1000 / 60);
    updateDataStore("input", "wpm", wpm);
  }

  // set active based on whether there is time left
  createComputed(() => {
    const active = dataStore.input.timeLeft > 0;
    if (active !== dataStore.input.active) {
      updateDataStore("input", "active", active);
    }
  });

  async function loop() {
    updateWPM();
    await sendSamples();
    updateDataStore("compare", "authPerson", await authenticate$(dataStore.data.testId));
  }

  // send samples every second, and update timeLeft
  createTimer(
    () => {
      updateDataStore("input", "timeLeft", dataStore.input.timeLeft - 1);
      void loop();
    },
    () => dataStore.input.active && dataStore.input.hasTyped && 1000,
    setInterval,
  );

  // send rest of samples when test finishes
  createEffect(
    on(
      () => dataStore.input.active,
      () => {
        if (dataStore.input.active) return;
        void loop();
      },
      {
        defer: true,
      },
    ),
  );

  return <DataStoreContext.Provider value={dataStore}>{props.children}</DataStoreContext.Provider>;
}

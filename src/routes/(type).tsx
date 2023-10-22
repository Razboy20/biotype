import { WindowEventListener } from "@solid-primitives/event-listener";
import clsx from "clsx";
import { Show, type VoidComponent } from "solid-js";
import { useDataStore } from "~/components/DataStore";
import Matchbar from "~/components/Matchbar";
import { TextInput } from "~/components/TextInput";
import { TypeField } from "~/components/TypeField";

// import "~/server/degreeOfDisorder";

const Type: VoidComponent = () => {
  const store = useDataStore();

  store.input.restart();

  return (
    <main class="content-stretch w-full flex flex-grow flex-row items-center justify-center p-8">
      <WindowEventListener onKeydown={store.input.keyDown} onKeyup={store.input.keyUp} />
      <div class="mr-32px h-full flex flex-shrink flex-col items-center justify-center container">
        <div
          class="flex flex-row items-center gap-4 text-3xl font-medium font-mono text-primary-600 transition-opacity duration-500 ease-out dark:text-primary-400"
          classList={{
            "opacity-0": !store.input.active,
            "opacity-50!": !store.input.hasTyped,
            "opacity-100": store.input.active,
          }}
        >
          <span>
            {store.input.timeLeft}
            <span class="ml-0.5 text-xs">SEC</span>
          </span>
          <div class="h-2 w-2 rounded-full bg-current opacity-80"></div>
          <span>
            {Math.round(store.input.wpm)}
            <span class="ml-0.5 text-xs">WPM</span>
          </span>
        </div>
        <TypeField
          class={clsx("transition-opacity duration-500 ease-in-out", {
            "opacity-50": !store.input.active,
          })}
        />
        <Show when={!store.input.active}>
          <div class="absolute border-2 border-neutral-200 rounded-xl px-10 py-8 text-center text-xl text-neutral-900 shadow-xl backdrop-blur-md dark:border-neutral-700 dark:text-neutral-50">
            <h1 class="text-2xl font-bold">{Math.round(store.input.typed.length)} TOTAL CHARS</h1>
            <h2 class="text-2xl font-bold">{Math.round(store.input.wpm)} WPM</h2>
            <Show when={store.compare.persons[0] !== undefined}>
              <h3>
                MOST SIMILAR TO: {store.compare.persons[0].name}, {store.compare.persons[0].similarity}
              </h3>
            </Show>
            <h3 class="mt-4">Save your results to database:</h3>
            <TextInput
              type="text"
              placeholder="Name"
              class="mt-2"
              value={store.data.name}
              onChange={(e) => store.data.setName(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (store.data.name.length > 2) {
                    store.sendResults();
                    store.input.restart();
                  }
                  e.preventDefault();
                  e.stopImmediatePropagation();
                }
              }}
            />
          </div>
        </Show>
      </div>
      <Matchbar persons={store.compare.persons} /> {/* should be sorted array */}
    </main>
  );
};

export default Type;

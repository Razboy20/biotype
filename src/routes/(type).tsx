import { WindowEventListener } from "@solid-primitives/event-listener";
import clsx from "clsx";
import { VoidComponent } from "solid-js";
import { useDataStore } from "~/components/DataStore";
import Matchbar from "~/components/Matchbar";
import { TypeField } from "~/components/TypeField";

// import "~/server/degreeOfDisorder";

const Type: VoidComponent = () => {
  const store = useDataStore();

  store.input.restart();

  return (
    <main class="p-8 w-full flex-grow flex flex-row items-center justify-center content-stretch h-0">
      <WindowEventListener onKeydown={store.input.keyDown} onKeyup={store.input.keyUp} />
      <div class="flex flex-col h-full items-center justify-center container flex-shrink mr-32px">
        <div
          class="dark:text-primary-400 text-primary-600 text-3xl font-mono font-medium transition-opacity duration-500 ease-out"
          classList={{
            "opacity-0": !store.input.active,
            "opacity-50!": !store.input.hasTyped,
            "opacity-100": store.input.active,
          }}
        >
          {store.input.timeLeft}
        </div>
        <TypeField class={clsx("transition-opacity duration-500 ease-in-out", {
          "opacity-50": !store.input.active,
        })} />
      </div>
      <Matchbar persons={store.compare.persons} /> {/* should be sorted array */}
    </main>
  );
};

export default Type;

import clsx from "clsx";
import type { VoidComponent } from "solid-js";
import { For, Show, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Caret } from "./Caret";
import { useDataStore } from "./DataStore";

interface TypeFieldProps {
  class?: string;
}

interface Words {
  letters: string[];
  index: number;
}

export const TypeField: VoidComponent<TypeFieldProps> = (props) => {
  const { input: store } = useDataStore();

  const [letters, setLetters] = createSignal<string[]>([]);
  const [words, setWords] = createSignal<Words[]>([]);

  createEffect(() => {
    setLetters(store.text.split(""));
    const words: Words[] = [];
    let word: Words = { letters: [], index: 0 };
    let index = 0;

    for (const letter of letters()) {
      if (letter === " ") {
        setWords((words) => [...words, word]);
        word = { letters: [], index: index + 1 };
      } else {
        word.letters.push(letter);
      }
      index++;
    }

    setWords((words) => [...words, word]);
  });

  const [letterRefs, updateLetterRefs] = createStore<HTMLElement[]>([]);
  const [rootRef, setRootRef] = createSignal<HTMLDivElement>();

  return (
    <>
      <div
        class={clsx(
          "relative flex flex-wrap content-start text-3xl font-mono text-neutral-500 dark:text-neutral-500/80",
          props.class,
        )}
        ref={setRootRef}
      >
        <Show when={store.active}>
          <Caret position={store.typed.length} rootRef={rootRef()} letterRefs={letterRefs} />
        </Show>
        <For each={words()}>
          {(word) => (
            <div
              class="relative m-2.5 block"
              classList={{
                "after:(absolute top-4 -right-3.5 content-empty bg-error-400 dark:bg-error-500 h-2 w-2 rounded-full)":
                  store.typed.length > word.index + word.letters.length &&
                  store.typed[word.index + word.letters.length] !== " ",
              }}
            >
              <For each={word.letters}>
                {(letter, i) => (
                  <span
                    ref={(e) => {
                      updateLetterRefs(word.index + i(), e);
                    }}
                    classList={{
                      "text-neutral-950 dark:text-neutral-100": store.typed[word.index + i()] === letter,
                      "text-error-400 dark:text-error-500":
                        store.typed.length > word.index + i() && store.typed[word.index + i()] !== letter,
                    }}
                  >
                    {letter}
                  </span>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

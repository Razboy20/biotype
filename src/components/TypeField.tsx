import clsx from "clsx";
import type { VoidComponent } from "solid-js";
import { For, Show, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import { css } from "solid-styled";
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

  const Caret: VoidComponent<{ position: number }> = (props) => {
    const x = () => {
      const rootLeft = rootRef()?.getBoundingClientRect().left;
      if (!rootLeft) return 10;

      const el = letterRefs[props.position]?.getBoundingClientRect();
      if (!el) {
        const el = letterRefs[props.position - 1]?.getBoundingClientRect();
        return el && el.left + el.width - rootLeft;
      }
      return el.left - rootLeft;
    };

    const y = () => {
      const rootTop = rootRef()?.getBoundingClientRect().top;
      if (!rootTop) return 10;

      const el = letterRefs[props.position]?.getBoundingClientRect();
      if (!el) {
        const el = letterRefs[props.position - 1]?.getBoundingClientRect();
        return el && el.top - rootTop;
      }
      return el.top - rootTop;
    };

    // only blink when the cursor has not moved in the last 1.5 seconds
    let timeout = setTimeout(() => {}, 0);
    const [isBlinking, setBlinking] = createSignal(false);

    createEffect(
      on(
        () => props.position,
        () => {
          setBlinking(false);
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            setBlinking(true);
          }, 1100);
        },
        {
          defer: false,
        },
      ),
    );

    css`
      .cursor-blink {
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0% {
          opacity: 0;
        }
        40% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `;

    return (
      <div
        class="absolute h-8 w-3px rounded-full bg-yellow-500 transition duration-75 ease-out-expo dark:bg-yellow-500"
        classList={{
          "cursor-blink": isBlinking(),
        }}
        style={{ transform: `translate(${x() - 1}px, ${y() + 1}px)` }}
      />
    );
  };

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
          <Caret position={store.typed.length} />
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

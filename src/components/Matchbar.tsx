import type { VoidComponent } from "solid-js";
import { For, createEffect, createSelector, createSignal, on } from "solid-js";
import server$ from "solid-start/server";
import { authenticate } from "~/server/authenticate";
import { useDataStore, type Person } from "./DataStore";

interface MatchbarProps {
  persons: Person[];
}

const Matchbar: VoidComponent<MatchbarProps> = (props) => {
  const store = useDataStore();

  const authenticate$ = server$(authenticate);

  const [authPerson, setAuthPerson] = createSignal<string>();

  createEffect(
    on(
      () => store.input.timeLeft,
      async () => {
        setAuthPerson(await authenticate$(store.data.testId));
      },
      {
        defer: true,
      },
    ),
  );

  const isAuthenticated = createSelector(authPerson);

  return (
    <div class="my-5 min-w-12rem w-fit flex flex-grow flex-col items-center self-stretch border-neutral-700 rounded-xl bg-white px-5 py-4 text-lg shadow-md dark:border-2 dark:bg-neutral-800 dark:text-white">
      <div class="font-bold">Similar to:</div>
      <div class="my-2 h-1px w-full bg-neutral-400 dark:bg-neutral-500"></div>

      <For each={props.persons}>
        {(person, i) => (
          <div
            classList={{
              "text-green-500": isAuthenticated(person.name),
            }}
          >
            {person.name} <span class="font-bold">{person.similarity}%</span>
          </div>
        )}
      </For>
    </div>
  );
};

export default Matchbar;

import { For, VoidComponent } from "solid-js";
import { Person } from "./DataStore";


interface MatchbarProps {
  persons: Person[];
}

const Matchbar: VoidComponent<MatchbarProps> = (props) => {
  return (
    <div class="min-w-12rem w-fit flex flex-col h-full py-4 px-5 text-lg flex-grow bg-white dark:bg-neutral-800 dark:text-white rounded-xl shadow dark:border-2 border-neutral-700 items-center">
      <div class="font-bold">
        Similar to:
      </div>
      <div class="my-2 h-1px w-full bg-neutral-400 dark:bg-neutral-500"></div>

      <For each={props.persons}>
        {(person) => (
          <div>
            {person.name}, {person.similarity * 100}%
          </div>
        )}
      </For>
    </div>
  );
}

export default Matchbar;

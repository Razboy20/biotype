import { TextField } from "@kobalte/core";
import type { TextFieldRootProps } from "@kobalte/core/dist/types/text-field";
import type { JSX } from "solid-js";
import { Show, splitProps } from "solid-js";
import { HelpTooltip } from "./HelpTooltip";

interface TextInputProps extends Omit<TextFieldRootProps, "oninput"> {
  placeholder?: string;
  label?: string;
  type: "text" | "password" | "email" | "number";
  errorMessage?: string;
  description?: string;
  helpTooltip?: string;
  oninput?: JSX.ChangeEventHandler<HTMLInputElement, InputEvent>;
  step?: number | string;
}

export const TextInput = (props: TextInputProps) => {
  const [local, others] = splitProps(props, ["step", "class"]);

  return (
    // @ts-expect-error incorrect type (on kobalte's end) on "onchange" property
    <TextField.Root class={props.class} classList={{ "flex-initial": true }} {...others}>
      <Show when={props.label}>
        <TextField.Label class="mb-2 flex-inline items-center gap-1 text-sm font-medium text-neutral-950 dark:text-white">
          {props.label}
          <Show when={props.helpTooltip}>
            <HelpTooltip tooltipText={props.helpTooltip}></HelpTooltip>
          </Show>
        </TextField.Label>
      </Show>
      <TextField.Input
        type={props.type}
        class="block w-full border border-neutral-300 rounded-lg bg-neutral-50 p-2.5 text-base text-neutral-900 outline-none dark:border-neutral-600 ui-invalid:border-error-500 dark:bg-neutral-700 dark:text-white focusable-form ui-invalid:focus:border-error-400 placeholder-neutral-500/80 dark:placeholder-neutral-400"
        placeholder={props.placeholder}
        step={props.step}
      />
      <TextField.Description class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {props.description}
      </TextField.Description>
      <TextField.ErrorMessage class="mt-2 text-sm text-error-500 dark:text-error-400">
        {props.errorMessage}
      </TextField.ErrorMessage>
    </TextField.Root>
  );
};

import { createEffect, createSignal, on, type VoidComponent } from "solid-js";
import { css } from "solid-styled";

interface CaretProps {
  position: number;
  rootRef?: HTMLDivElement;
  letterRefs: HTMLElement[];
}

export const Caret: VoidComponent<CaretProps> = (props) => {
  const x = () => {
    const rootLeft = props.rootRef?.getBoundingClientRect().left;
    if (!rootLeft) return 10;

    const el = props.letterRefs[props.position]?.getBoundingClientRect();
    if (!el) {
      const el = props.letterRefs[props.position - 1]?.getBoundingClientRect();
      return el && el.left + el.width - rootLeft;
    }
    return el.left - rootLeft;
  };

  const y = () => {
    const rootTop = props.rootRef?.getBoundingClientRect().top;
    if (!rootTop) return 10;

    const el = props.letterRefs[props.position]?.getBoundingClientRect();
    if (!el) {
      const el = props.letterRefs[props.position - 1]?.getBoundingClientRect();
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

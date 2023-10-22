import { createResizeObserver } from "@solid-primitives/resize-observer";
import { createEffect, createMemo, createSignal, on, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { A, useLocation } from "solid-start";
import logo from "~/assets/img/logo.svg";
import { HelpTooltip } from "./HelpTooltip";
import styles from "./Navbar.module.scss";
import { ThemeControllerButton } from "./ThemeController";

export default function Navbar() {
  const location = useLocation();

  const routeLocations = ["/", "/about"];
  const buttons: HTMLAnchorElement[] = [];
  const [linkContainer, setLinkContainer] = createSignal<HTMLDivElement>();
  const [indicatorEl, setIndicatorEl] = createSignal<HTMLDivElement>();

  const getPathIndex = createMemo(() => routeLocations.findIndex((ref) => ref.match(location.pathname)));

  // when page changes, transition navbar_indicator properties
  const [indicatorDirection, setIndicatorDirection] = createSignal(Direction.RIGHT);

  createEffect<number>((prevIndex) => {
    setIndicatorDirection((prevIndex ?? getPathIndex()) < getPathIndex() ? Direction.RIGHT : Direction.LEFT);

    const el = indicatorEl();
    if (!el) throw new Error();

    el.style.transition = `left 350ms ${
      indicatorDirection() === Direction.LEFT ? "cubic-bezier(1,0,.3,1) -140ms" : "cubic-bezier(.75,0,.24,1) -40ms"
    },right 350ms ${
      indicatorDirection() === Direction.RIGHT ? "cubic-bezier(1,0,.3,1) -140ms" : "cubic-bezier(.75,0,.24,1) -40ms"
    }`;

    return getPathIndex();
  });

  const updateIndicator = (transition = true) => {
    const el = indicatorEl();
    if (!el) throw new Error();

    el.style.left = `${buttons[getPathIndex()]?.offsetLeft}px`;
    el.style.right = `${
      linkContainer()!.clientWidth - (buttons[getPathIndex()]?.offsetLeft + buttons[getPathIndex()]?.offsetWidth)
    }px`;

    if (!transition) el.style.transition = "none";
  };

  // Compute style on first run, after DOM is ready.
  onMount(() => {
    // eslint-disable-next-line solid/reactivity
    queueMicrotask(() => {
      updateIndicator(false);
    });
  });

  // Compute style normally for subsequent runs.
  createEffect(
    on(
      [getPathIndex],
      () => {
        updateIndicator();
      },
      { defer: true },
    ),
  );

  createResizeObserver(linkContainer, () => {
    updateIndicator(false);
  });

  return (
    <nav class={styles.navbar_sizer}>
      <div class={styles.navbar}>
        <div class={styles.title}>
          <A href="/" class="h-auto p-0 px-1.5 font-600 hover:bg-neutral-100/70 btn dark:hover:bg-neutral-100/10">
            <img src={logo} alt="Biotype logo" class="mr-2 h-8 w-8 rounded-md" />
            <span class="hidden xs:block">BioType</span>
            <HelpTooltip tooltipText="Biometric Typing (BioType) identifier test" />
          </A>
        </div>
        <div
          class={styles.links}
          classList={{
            [styles.loading]: isServer,
          }}
          ref={setLinkContainer}
        >
          <A href="/" end activeClass={styles.active} ref={(e) => buttons.push(e)}>
            Type
          </A>
          <A href="/about" activeClass={styles.active} ref={(e) => buttons.push(e)}>
            About
          </A>
          <div
            class="absolute bottom-0 h-1 select-none rounded-full bg-primary-400 dark:bg-primary-500"
            ref={setIndicatorEl}
            style={{
              visibility: `${isServer ? "hidden" : "visible"}`,
            }}
          />
          <ThemeControllerButton />
        </div>
      </div>
    </nav>
  );
}

enum Direction {
  LEFT = "left",
  RIGHT = "right",
}

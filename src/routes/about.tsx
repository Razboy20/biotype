import { type VoidComponent } from "solid-js";

export const About: VoidComponent = () => {
  return (
    <main class="p-8 text-xl prose prose-neutral dark:prose-invert">
      <div>This project was made by: ___.</div>
      <div class="my-4 text-4xl font-bold italic">What?</div>
      <span>Biometric authentication that tries to identify you by your typing habits.</span>
      <div class="my-4 text-4xl font-bold italic">Why?</div>
      <span>This is because we're apparently very into typing tests.{"\n"}Rule of cool babeyyyyyy</span>
      <div class="my-4 text-4xl font-bold italic">How?</div>
      <span>{"[insert literature here ig]"}</span>
    </main>
  );
};

export default About;

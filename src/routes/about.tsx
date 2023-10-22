import { type VoidComponent } from "solid-js";

export const About: VoidComponent = () => {
  return (
    <main class="flex items-center justify-center">
      <div class="p-8 text-xl prose prose-neutral dark:prose-invert">
        <div>This project was made by: Elie Soloveichik, Boueny Folefack, Anya (Andre) Chen, and John Jennings.</div>
        <div class="my-4 text-4xl font-bold italic">What?</div>
        <span>
          Biometric authentication that tries to identify you by your typing habits. After giving the database a few
          samples under the same user name, it will be able to authenticate you (your name will be highlighted green in
          the side bar)!
        </span>
        <div class="my-4 text-4xl font-bold italic">Why?</div>
        <span>
          This is because we're apparently very into typing tests.
          <br />
          Rule of cool babeyyyyyy
        </span>
        <div class="my-4 text-4xl font-bold italic">How?</div>
        <span>
          In short, we compare the relative speed at which you type each 3-letter string, versus other typers. With
          that, we find the most similar user; if you are similar enough to that, without being too similar to any other
          users, we authenticate you as that user.
        </span>
        <hr></hr>
        <div class="text-base" style={{ "margin-left": "2em", "text-indent": "-2em" }}>
          <div class="font-bold text-center">Citations:</div>
          <div>
            Bergadano, Francesco, et al. “User Authentication through Keystroke Dynamics.”{" "}
            <i>ACM Transactions on Information and System Security</i>, vol. 5, no. 4, Nov. 2002, pp. 367–97.{" "}
            <i>DOI.org (Crossref)</i>, https://doi.org/10.1145/581271.581272.
          </div>
          <div class="mt-2">
            Rudrapal, Dwijen, et al.{" "}
            <i>A Study And Analysis of Keystroke Dynamics And Its Enhancement For Proficient User Authentication</i>.
            2012.
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;

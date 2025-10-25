import type { ReactElement } from "react";

import classes from "@/components/pages/About.module.css";
import LinkButton from "@/components/ui/LinkButton";

interface AboutProps {
  imgUrl: string;
}

export default function About({ imgUrl }: AboutProps): ReactElement {
  return (
    <section className={classes.about}>
      <h2>Welcome to cinefil 🎥</h2>
      <p>
        "cinefil.me" is a profile page for movie lovers created by{" "}
        <a href="https://github.com/chocolat5" target="_blank">
          chocolat
        </a>
        , a developer based in Japan and Europe.
      </p>
      <p>
        Create and share your personalized profile featuring your favorite
        movies, directors, actors, and more.
      </p>
      <img src={imgUrl} width="532" height="337" alt="" fetchPriority="high" />
      <p className="center primary">Try it now with passwordless login! </p>
      <div className={classes.buttonWrap}>
        <LinkButton href="/login" ariaLabel="create profile">
          Create a profile now!
        </LinkButton>
      </div>
      <h2>Share ideas & feedback</h2>
      <p>
        I'd love to hear how you'd like to use cinefil! I also appreciate any
        bug reports, suggestions, or questions. If you have it, please{" "}
        <a href="mailto:hello@cinefil.me" target="_blank">
          reach out
        </a>
        .
      </p>
      <p>
        You can also see upcoming features in the roadmap on the{" "}
        <a href="https://github.com/chocolat5/cinefil" target="_blank">
          GitHub repo
        </a>
        .
      </p>
      <p>
        * This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
    </section>
  );
}

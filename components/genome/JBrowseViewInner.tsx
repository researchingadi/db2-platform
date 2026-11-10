"use client";

import { useEffect, useState } from "react";
import { createViewState, JBrowseLinearGenomeView } from "@jbrowse/react-linear-genome-view";

export type JBrowseViewState = ReturnType<typeof createViewState>;

interface Props {
  assembly: object;
  tracks: object[];
  speciesKey: string;
  /** Called once the view state exists, so the parent can read/drive the view via its API. */
  onReady?: (state: JBrowseViewState) => void;
}

/*
 * Dark "arcade" theme for the embedded viewer. createViewState passes configuration.theme
 * (a frozen config slot) to createJBrowseTheme, which deep-merges it into MUI createTheme, so
 * palette, typography and shape all apply. Colours are the hex values of the tokens in
 * app/globals.css (JBrowse/MUI need concrete colours; CSS variables can't be colour-manipulated).
 */
const ARCADE_THEME = {
  palette: {
    mode: "dark",
    // --db-violet (#8d7cff) darkened in HSL lightness (74% → 67%, same hue/saturation) so white
    // text on it reaches 4.65:1 (the token itself gives only 3.25:1).
    primary: { main: "#6e58ff" },
    secondary: { main: "#00f0ff" }, // --db-cyan
    tertiary: { main: "#49ffb6" }, // --db-green
    quaternary: { main: "#ff2e93", contrastText: "#030303" }, // --arcade-pink, --db-black text (5.96:1)
    highlight: { main: "#00f0ff" }, // --db-cyan (tertiary green already marks the overview)
    background: { default: "#030303", paper: "#080808" }, // --db-black, --db-charcoal
    // Standard JBrowse/IGV hues (A green, C blue, G orange, T red). A and C use lighter shades of
    // the same MUI hues for contrast on black and better red/green colour-blind separation.
    bases: {
      A: { main: "#81c784" }, // green 300 (default green 500)
      C: { main: "#64b5f6" }, // blue 300 (default blue 500)
      G: { main: "#ff9800" }, // orange 500 (default)
      T: { main: "#f44336" }, // red 500 (default)
    },
  },
  // typography.fontFamily is intentionally not set: JBrowse lays out feature labels with its own
  // text-width estimate, and the site's wider sans font made neighbouring labels collide.
  shape: { borderRadius: 0 },
  components: {
    // JBrowse's dark mode forces white text on every button; contained cyan buttons need black.
    MuiButton: { styleOverrides: { containedSecondary: { color: "#030303" } } }, // --db-black
  },
};

export default function JBrowseViewInner({ assembly, tracks, speciesKey, onReady }: Props) {
  const [state] = useState(() =>
    createViewState({
      assembly,
      tracks,
      configuration: { theme: ARCADE_THEME },
      defaultSession: {
        name: `DB² Session — ${speciesKey}`,
        view: {
          id: "linearGenomeView",
          type: "LinearGenomeView",
        },
      },
    })
  );

  useEffect(() => {
    onReady?.(state);
    // Run once per created state; onReady identity changes must not re-fire it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 130px)",
        minHeight: "600px",
      }}
    >
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}

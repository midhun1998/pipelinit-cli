import { IntrospectFn } from "../../../types.ts";
import { hasNodeDependencyAny } from "./dependencies.ts";

const webApps = [
  "express",
  "vue",
  "@angular/cli",
  "ember-cli",
  "react",
  "svelte",
  "gatsby",
  "nuxt",
  "bootstrap",
  "abc",
  "alosaur",
  "attain",
  "deno-express",
  "denotrain",
  "aqua",
  "dinatra",
  "doa",
  "drash",
  "dragon",
  "microraptor",
  "oak",
  "opine",
  "pogo",
  "servest",
];

export const introspect: IntrospectFn<string | null> = async (context) => {
  if (await hasNodeDependencyAny(context, webApps)) {
    return "webApp";
  }
  return null;
};

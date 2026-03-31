import * as en from "./en";
import * as ar from "./ar";

const resources = {
  en,
  ar,
};

export default resources;

// Types
export type Resources = typeof resources;
export type Namespaces = keyof typeof en;

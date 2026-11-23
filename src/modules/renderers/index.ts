export type {LifeCycle} from "./@contract/@types";

export * from "./@impl";

import {RenderersDetails} from "./@contract/";
import type { Satisfies } from "MWL@2026/modules/@types";

declare const _: Satisfies<typeof import("."),
                            RenderersDetails>;
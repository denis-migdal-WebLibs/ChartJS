export * from "./@impl";

import {ObjectMetadataDetails} from "./@contract/";
import type { Satisfies } from "MWL@2026/modules/@types";

declare const _: Satisfies<typeof import("."),
                            ObjectMetadataDetails>;
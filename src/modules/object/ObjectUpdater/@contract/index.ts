import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Effects, UpdateFct } from "./@types";

export interface ObjectUpdaterDetails {
    ObjectUpdater<T extends Record<string, any>, O>(
                effects: Partial<Effects<O, NoInfer<T>>>
            ): (target: O, data: Properties<T>) => UpdateFct;
}
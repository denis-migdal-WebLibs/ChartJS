import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { PropertiesRenderer } from "MWL@2026/modules/Reactive/PropertiesRenderer";
import { Effects } from "../@contract/@types";

export function ObjectUpdater<T extends Record<string, any>, O>(
                effects: Partial<Effects<O, NoInfer<T>>>
            ) {

    return (target: O, data: Properties<T>) => {

        const renderer = new PropertiesRenderer( data );

        for(const key in effects)
            // @ts-expect-error
            renderer.addRule([key], () => effects[key]!(
                                                target,
                                                data[key],
                                                data
                                            ) );

        return () => renderer.render();
    }
}
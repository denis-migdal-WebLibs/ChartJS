import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { PropertiesRenderer } from "MWL@2026/modules/Reactive/PropertiesRenderer";

// We can't use this if we want to be able to reuse the function.
type Effects<CO, T extends Record<string, any>> = {
    [K in keyof T]: (target: CO, value: T[K], values: T) => void
}

export function ChartObjectUpdater<T extends Record<string, any>, CO>(
                effects: Partial<Effects<CO, NoInfer<T>>>
            ) {

    return (target: CO, data: Properties<T>) => {

        const chartObject = target;
        const renderer    = new PropertiesRenderer( data );

        for(const key in effects)
            // @ts-expect-error
            renderer.addRule([key], () => effects[key]!(
                                                chartObject,
                                                data[key],
                                                data
                                            ) );

        return () => renderer.render();
    }
}
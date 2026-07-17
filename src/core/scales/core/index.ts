import { ScaleOptions, ScaleType } from "chart.js";
import createComponentClass, { CreateComponentOptions, PropertiesBindings } from "Chart@2026:core/createComponentClass";
import { PropertiesDescriptors, Constant, Value } from "MWL@2026:Reactive/Properties";

// agnostic.
export function createScaleClass<
                    N    extends string,
                    T    extends Record<string, any>,
                    P    extends PropertiesDescriptors<T>,
                    B    extends Partial<PropertiesBindings<
                                            NoInfer<T>,
                                            ScaleOptions<NoInfer<T["type"]>>
                                        >>,
                >(options: 
                    Omit<   CreateComponentOptions<N, T, P, ScaleOptions<NoInfer<T["type"]>>, B>,
                            "attach"|"detach"
                        >) {

    return createComponentClass({
        ...options,
        attach: (binding) => {
            binding.chart.chartJS.options.scales![binding.name]
                                                = binding.context.chartObject;
        },
        detach: (binding) => {
            delete binding.chart.chartJS.options.scales![binding.name];
        }
    });
}


export const BaseScale = {
    properties: {
        type    : Constant<ScaleType>("linear"),
        display : Value<boolean>(true),
    },
    bindings: {
        type: (scale: ScaleOptions<ScaleType>, value: ScaleType) => {
            scale.type = value;
        },
        display: (scale: ScaleOptions<ScaleType>, value: boolean) => {
            scale.display  = value;
        }
    }
}
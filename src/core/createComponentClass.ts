import { Component, ComponentBinding } from "Chart@2026:core/Chart/Controller";
import registerComponent from "Chart@2026:core/registerComponent";
import { WithProperties } from "MWL@2026:Reactive/Properties/createProperties";
import PropertiesRenderer from "MWL@2026:Reactive/Properties/PropertiesRenderer";
import { PropertiesDescriptors } from "MWL@2026:Reactive/Properties/Property";
import { FCT_NULL_OBJ } from "MWL@2026:types/NullObjects";

//type ChartType = keyof ChartTypeRegistry;

export type BaseComponentBinding<
                        T extends Record<string, any>,
                        U
                    > = ComponentBinding<{
    renderer   : PropertiesRenderer<T>,
    chartObject: U
}>;

// we need to distinguish value from properties for type inference reasons.
// cf https://github.com/microsoft/TypeScript/issues/63643
export type PropertyBinding<CTX extends Record<string, any>,
                            CO,
                            V
            > = (
                chartObject: CO,
                value      : V,
                properties : CTX
            ) => void;

export type PropertiesBindings< T extends Record<string,any>, CO > = {
    [K in keyof T]: PropertyBinding<T, CO, T[K]>
}

export type CreateComponentOptions<
            N    extends string,
            T    extends Record<string, any>,
            P    extends PropertiesDescriptors<T>,
            CO   extends object,
            B    extends Partial<PropertiesBindings<NoInfer<T>, NoInfer<CO>>>,
        > = {
    name        : N,
    chartObject?: Partial<CO>|(() => Partial<CO>),
    // enable the inference of T...
    properties: P & PropertiesDescriptors<T>,
    bindings  : B & Record<Exclude<keyof B, keyof T>, never>,
    attach    : (binding: BaseComponentBinding<T, NoInfer<CO>>) => void,
    detach    : (binding: BaseComponentBinding<T, NoInfer<CO>>) => void,
}

// agnostic.
export default function createComponentClass<
            N    extends string,
            T    extends Record<string, any>,
            P    extends PropertiesDescriptors<T>,
            CO   extends object,
            B    extends Partial<PropertiesBindings<NoInfer<T>, NoInfer<CO>>>,
        >(options: CreateComponentOptions<N, T, P, CO, B>) {

    let chartObject: () => Partial<CO>;
    if( options.chartObject === undefined)
        chartObject = FCT_NULL_OBJ;
    else if( typeof options.chartObject !== "function" )
        chartObject = () => structuredClone(options.chartObject as Partial<CO>);
    else
        chartObject = options.chartObject;

    //TODO: own event (?).
    class BaseComponent extends WithProperties(options.properties)
                        implements Component {

        static override name = options.name;
        static properties    = options.properties;
        static bindings      = options.bindings;

        static chartObject = options.chartObject ?? {};

        attach(binding: BaseComponentBinding<T, CO>) {

            const renderer = new PropertiesRenderer<T>(this.properties);

            for(let key in options.bindings) {
                const b = options.bindings[key as keyof T] as any;
                renderer.bind(key as any, () => {
                    b(  binding.context.chartObject,
                        this.properties[key],
                        this.properties );
                });
            }

            binding.context = {
                    chartObject: chartObject() as any,
                    renderer
            };

            options.attach(binding);
        }

        detach(binding: BaseComponentBinding<T, CO>){
            options.detach(binding);
        }

        update(binding: BaseComponentBinding<T, CO>){
            return binding.context.renderer.render()
        }
    }

    registerComponent(BaseComponent);

    return BaseComponent;
}
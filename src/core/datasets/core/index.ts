import { ChartDataset } from "chart.js";
import { Component, ComponentBinding } from "Chart@2026:core/Chart/Controller";
import registerComponent from "Chart@2026:core/registerComponent";
import { WithProperties } from "MWL@2026:Reactive/Properties/createProperties";
import PropertiesRenderer from "MWL@2026:Reactive/Properties/PropertiesRenderer";
import { PropertiesDescriptors } from "MWL@2026:Reactive/Properties/Property";
import { NULL_OBJ } from "MWL@2026:types";

//type ChartType = keyof ChartTypeRegistry;

type DatasetBinding<
                    T extends Record<string, any>,
                > = ComponentBinding<{
    dataset : ChartDataset<T["type"]> /*& DatasetExtra*/
    renderer: PropertiesRenderer<T>
}>;

// we need to distinguish value from properties for type inference reasons.
// cf https://github.com/microsoft/TypeScript/issues/63643
type Binding<CTX extends Record<string, any>,
             V
            > = (
                dataset   : ChartDataset<CTX["type"]>,
                value     : V,
                properties: CTX
            ) => void;

type Bindings<  T extends Record<string,any> > = {
    [K in keyof T]: Binding<T, T[K]>
}



// agnostic.
export function createDatasetClass<
                                N    extends string,
                                T    extends Record<string, any>,
                                B    extends Bindings<NoInfer<T>>,
                            >(options: {
                            name      : N,
                            //TODO: do like bindings (?).
                            properties: PropertiesDescriptors<T>,
                            bindings  : B & Record<Exclude<keyof B, keyof T>, never>,
                            datasetPreset?: Partial<ChartDataset<NoInfer<T["type"]>>>
                        }) {

    const datasetPreset = options.datasetPreset ?? NULL_OBJ;

    //TODO: own event (?).
    class Dataset extends WithProperties(options.properties)
                        implements Component {

        static override name = options.name;
        static properties    = options.properties;
        static bindings      = options.bindings;

        attach(binding: DatasetBinding<T>) {

            const renderer = new PropertiesRenderer<T>(this.properties);

            for(let key in options.bindings) {
                const b = options.bindings[key as keyof T] as B[keyof T];
                renderer.bind(key as any, () => {
                    b(  binding.context.dataset,
                        this.properties[key],
                        this.properties );
                });
            }

            binding.context = {
                    dataset: Object.assign({}, datasetPreset) as any,
                    renderer
            };
            binding.chart.chartJS.data.datasets.push(binding.context.dataset);
        }

        detach(binding: DatasetBinding<T>){
            const datasets = binding.chart.chartJS.data.datasets;
            const idx = datasets.indexOf(binding.context.dataset);
            if( __DEBUG__ && idx === -1)
                throw new Error("Dataset not found");
            datasets.splice(idx, 1);
        }

        update(binding: DatasetBinding<T>){
            return binding.context.renderer.render()
        }
    }

    registerComponent(Dataset);

    return Dataset;
}
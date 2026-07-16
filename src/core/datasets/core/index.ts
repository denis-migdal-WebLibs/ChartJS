import { ChartDataset, ChartTypeRegistry } from "chart.js";
import createComponentClass, { CreateComponentOptions, PropertiesBindings } from "Chart@2026:core/createComponentClass";
import { Datalabel } from "Chart@2026:core/plugins/Datalabels";
import { TooltipLabel } from "Chart@2026:core/plugins/Tooltips";
import { PropertiesDescriptors } from "MWL@2026:Reactive/Properties/Property";

type DatasetPlugins = {
    tooltip  ?: TooltipLabel
    datalabel?: Datalabel
}

type DatasetObject<T extends keyof ChartTypeRegistry>
    = ChartDataset<T> & {
        plugins: DatasetPlugins
    }

// agnostic.
export function createDatasetClass<
                    N    extends string,
                    T    extends Record<string, any>,
                    P    extends PropertiesDescriptors<T>,
                    B    extends Partial<PropertiesBindings<
                                        NoInfer<T>,
                                        DatasetObject<NoInfer<T>["type"]>
                                    >>,
                >(options: 
                    Omit<   CreateComponentOptions<N, T, P, DatasetObject<NoInfer<T>["type"]>, B>,
                            "attach"|"detach"
                        >) {

    return createComponentClass({
        ...options,
        attach: (binding) => {
            binding.chart.chartJS.data.datasets.push(binding.context.chartObject);
        },
        detach: (binding) => {
            const datasets = binding.chart.chartJS.data.datasets;
            const idx = datasets.indexOf(binding.context.chartObject);
            if( __DEBUG__ && idx === -1)
                throw new Error("Dataset not found");
            datasets.splice(idx, 1);
        }
    });
}
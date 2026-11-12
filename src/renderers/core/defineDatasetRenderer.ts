import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { ChartObjectUpdaterFactory, defineRenderer, Factory, Klass } from "./defineRenderer";
import { LifeCycle } from "./LifeCycle";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";

export type DatasetObject = {
    [K in keyof ChartTypeRegistry]: ChartDataset<K>
}[keyof ChartTypeRegistry];

export function defineDatasetRenderer<
                                    T  extends Record<string, any>,
                                    CO extends DatasetObject
                                >(
   Model              : Klass<Properties<T>>,
   ChartObject        : Factory<CO>,
   ChartObjectUpdater : ChartObjectUpdaterFactory<T, CO>,
) {
    return defineRenderer(
                            Model,
                            ChartObject,
                            ChartObjectUpdater,
                            DatasetLifeCycle
                        );
}


export const DatasetLifeCycle = {
    attach(target, chartObject){
        target.data.datasets.push(chartObject);
    },
    detach(target, chartObject){
        const datasets = target.data.datasets;
        const idx      = datasets.indexOf(chartObject);
        __ASSERT__(idx !== -1, "Dataset not found");

        datasets.splice(idx, 1);
    },
} satisfies LifeCycle<DatasetObject>;
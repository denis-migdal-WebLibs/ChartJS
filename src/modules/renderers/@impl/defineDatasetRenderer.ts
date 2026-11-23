import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { DatasetObject, Factory, Klass, LifeCycle, ObjectUpdaterFactory } from "../@contract/@types";
import { defineRenderer } from "./defineRenderer";

export function defineDatasetRenderer<
                                    T   extends Record<string, any>,
                                    CO  extends DatasetObject
                                >(
        Model                : Klass<Properties<T>>,
        ChartComponentConfig : Factory<CO>,
        ChartComponentUpdater: ObjectUpdaterFactory<T, CO>,
    ) {

    return defineRenderer(
        Model,
        ChartComponentConfig,
        ChartComponentUpdater,
        DatasetLifeCycle
    );
}


export const DatasetLifeCycle = {
    attach(target, chartComponentConfig){
        target.data.datasets.push(chartComponentConfig);
    },
    detach(target, chartComponentConfig){
        const datasets = target.data.datasets;
        const idx      = datasets.indexOf(chartComponentConfig);
        __ASSERT__(idx !== -1, "Dataset not found");

        datasets.splice(idx, 1);
    },
} satisfies LifeCycle<DatasetObject>;
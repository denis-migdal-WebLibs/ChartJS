import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { DatasetObject, Factory, Klass, LifeCycle, ObjectUpdaterFactory, Renderer } from "./@types";

export interface RenderersDetails {
    getRenderer(target: object): Renderer;

    defineDatasetRenderer<
                            T  extends Record<string, any>,
                            CO extends DatasetObject
                        >(
        Model                : Klass<Properties<T>>,
        ChartComponentConfig : Factory<CO>,
        ChartComponentUpdater: ObjectUpdaterFactory<T, CO>,
    ): void;

    defineRenderer<
                    T   extends Record<string, any>,
                    CCC extends object
                >(
                    Model                : Klass<Properties<T>>,
                    ChartComponentConfig : Factory<CCC>,
                    ChartComponentUpdater: ObjectUpdaterFactory<T, CCC>,
                    lifeCycle            : LifeCycle<CCC>,
                ): void;
}
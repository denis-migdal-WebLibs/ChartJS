import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Factory, Klass, LifeCycle, ObjectUpdaterFactory, RendererProvider } from "../@contract/@types";
import { ObjectMetadata } from "Chart@2026/modules/object";

export const RendererProviderMetadata = new ObjectMetadata<RendererProvider>("renderer");

export function defineRenderer<
                                    T   extends Record<string, any>,
                                    CCC extends object
                                >(
                    Model                : Klass<Properties<T>>,
                    ChartComponentConfig : Factory<CCC>,
                    ChartComponentUpdater: ObjectUpdaterFactory<T, CCC>,
                    lifeCycle            : LifeCycle<CCC>,
                ) {

    RendererProviderMetadata.set(Model, (model: Properties<T>) => {
        
        const chartObject = ChartComponentConfig();
        const update      = ChartComponentUpdater(chartObject, model);

        return {
            attach(chartJS) {
                lifeCycle.attach(chartJS, chartObject);
            },
            detach(chartJS) {
                lifeCycle.detach(chartJS, chartObject);
            },
            update,
        }
    });
}
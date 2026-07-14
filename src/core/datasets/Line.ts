import {Chart, ScatterController, LineElement, PointElement, LineController} from 'chart.js';
import { createDatasetClass } from './core';
import Dataset, { DatasetProperties } from './Dataset';
import { Constant, Value } from 'MWL@2026:Reactive/Properties/Controllers';
import { WithComponent } from 'Chart@2026:core/registerComponent';
Chart.register(ScatterController, LineElement, PointElement, LineController);

//TODO: data + parsedData (view)...
const Line = createDatasetClass({
    name         : "Line",
    datasetPreset: {
        showLine   : true,
        borderWidth: 2,
        parsing    : false as const,
        normalized : true
    },
    properties: {
        ...DatasetProperties,
        type      : Constant<"scatter">("scatter"),
        showPoints: Value   <boolean>  (false),
        data      : Value   <number>(2)
    },
    bindings: {
        ...Dataset.bindings,
        data      : (_dataset, _v) => {},
        showPoints: (dataset, showPoints) => {
            if( showPoints )
                delete dataset.pointRadius;
            else
                dataset.pointRadius = 0;
        }
    },
});

declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof Line> {}
}

export default Line;
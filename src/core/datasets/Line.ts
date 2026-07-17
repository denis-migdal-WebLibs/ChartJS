import {Chart, ScatterController, LineElement, PointElement, LineController} from 'chart.js';
import { createDatasetClass } from './core';
import Dataset from './Dataset';
import { Constant, Value } from 'MWL@2026:Reactive/Properties';
import { WithComponent } from 'Chart@2026:core/registerComponent';
Chart.register(ScatterController, LineElement, PointElement, LineController);

const Line = createDatasetClass({
    name         : "Line",
    chartObject  : {
        showLine   : true,
        borderWidth: 2,
        parsing    : false as const,
        normalized : true
    },
    properties: {
        ...Dataset.properties,
        type      : Constant<"scatter">("scatter"),
        showPoints: Value   <boolean>  (false),
    },
    bindings: {
        ...Dataset.bindings,
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
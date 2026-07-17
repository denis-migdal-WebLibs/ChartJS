import { createDatasetClass } from './core';
import Dataset from './Dataset';
import { Constant } from 'MWL@2026:Reactive/Properties';
import { WithComponent } from 'Chart@2026:core/registerComponent';

import {Chart, ScatterController, PointElement} from 'chart.js';
Chart.register(ScatterController, PointElement);

const Points = createDatasetClass({
    name         : "Points",
    chartObject  : {
        type       : "scatter",
        borderWidth: 2,
        parsing    : false,
        normalized : true
    },
    properties: {
        ...Dataset.properties,
        type      : Constant<"scatter">("scatter"),
    },
    bindings: Dataset.bindings,
});

declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof Points> {}
}

export default Points;
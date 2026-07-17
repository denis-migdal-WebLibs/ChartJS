import {Chart, ScatterController, LineElement, PointElement, LineController} from 'chart.js';
import { createDatasetClass } from './core';
import { WithComponent } from 'Chart@2026:core/registerComponent';
import Line from './Line';
import { Constant, Value, View } from 'MWL@2026:Reactive/Properties';
import { NULL_ARRAY } from 'MWL@2026:types';
Chart.register(ScatterController, LineElement, PointElement, LineController);

class ValueConverter {

    readonly cache = [
                        {x: 0, y: Number.NEGATIVE_INFINITY},
                        {x: 0, y: Number.POSITIVE_INFINITY}
                    ];

    convert(data: null|number) {

        if(data === null)
            return NULL_ARRAY;

        this.cache[0].x = data;
        this.cache[1].x = data;

        return this.cache;
    }
}

const VLine = createDatasetClass({
    name         : "VLine",
    chartObject  : Line.chartObject,
    properties: {
        ...Line.properties,
        data      : Value<number|null>(null),
        parsedData: View("data", ValueConverter),
        showPoints: Constant<boolean>(false),
    },
    bindings: {
        ...Line.bindings,
    },
});

declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof VLine> {}
}

export default VLine;
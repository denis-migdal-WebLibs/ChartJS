import { Constant, Value, View } from 'MWL@2026:exports/Reactive/Properties/controllers';
import { NULL_ARRAY } from 'MWL@2026:exports/types';
import { WithComponent } from 'Chart@2026:core/registerComponent';
import { createDatasetClass } from './core';
import Line from './Line';

import {Chart, ScatterController, LineElement, PointElement, LineController} from 'chart.js';
Chart.register(ScatterController, LineElement, PointElement, LineController);

class ValueConverter {

    readonly cache = [
                        {x: Number.NEGATIVE_INFINITY, y: 0},
                        {x: Number.POSITIVE_INFINITY, y: 0}
                    ];

    convert(data: null|number) {

        if(data === null)
            return NULL_ARRAY;

        this.cache[0].y = data;
        this.cache[1].y = data;

        return this.cache;
    }
}

const HLine = createDatasetClass({
    name         : "HLine",
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
    interface ChartController extends WithComponent<typeof HLine> {}
}

export default HLine;
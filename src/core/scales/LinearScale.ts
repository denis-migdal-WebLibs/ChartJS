import { Constant, Value } from "MWL@2026:Reactive/Properties/Controllers";
import { BaseScale, createScaleClass } from "./core";

import {Chart, LinearScale} from 'chart.js';
import { WithComponent } from "Chart@2026:core/registerComponent";
Chart.register(LinearScale);

const LScale = createScaleClass({
    name: "LinearScale",
    chartObject: {
        offset     : false,
        grid       : { offset: false },
        beginAtZero: true,
    },
    properties: {
        ...BaseScale.properties,
        type    : Constant<"linear">("linear"),
        position: Value<null|"left"|"right"|"bottom"|"top">(null),
        min     : Value<number|null>(null),
        max     : Value<number|null>(null),
    },
    bindings  : {
        position: (scale, value) => { //TODO: auto ?
            if( value === null) {
                delete scale.position;
                return;
            }
            scale.position = value;
        },
        min: (scale, value) => {
            if( value === null) {
                delete scale.min;
                return;
            }
            scale.min = value;
        },
        max: (scale, value) => {
            if( value === null) {
                delete scale.max;
                return;
            }
            scale.max = value;
        },
    }
});

export default LScale;


declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof LScale> {}
}
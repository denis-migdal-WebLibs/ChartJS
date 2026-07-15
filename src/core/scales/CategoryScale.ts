import { Constant, Signal, Value } from "MWL@2026:Reactive/Properties/Controllers";
import { BaseScale, createScaleClass } from "./core";

import {Chart, CategoryScale} from 'chart.js';
import { WithComponent } from "Chart@2026:core/registerComponent";
Chart.register(CategoryScale);

const CScale = createScaleClass({
    name: "CategoryScale",
    chartObject: {
        offset: true,
        grid  : { offset: true }
    },
    properties: {
        ...BaseScale.properties,
        type    : Constant<"category">("category"),
        position: Value<null|"left"|"right"|"bottom"|"top">(null),
        labels  : Signal<readonly string[]|null>(null),
    },
    bindings  : {
        position: (scale, value) => { //TODO: auto ?
            if( value === null) {
                delete scale.position;
                return;
            }
            scale.position = value;

            scale.reverse = value === "left" || value === "right";
            if( scale.reverse ) {
                scale.ticks = CatTicks;
            } else {
                delete scale.ticks;
            }
        },
        labels: (scale, value) => {
            if(value === null) {
                // not sure what labels = null means...
                delete scale.labels;
                return;
            }
            scale.labels = value as any; // needs RW.
        }
    }
});

export default CScale;

const CatTicks = {
    padding: 0,
    align: 'start',
    crossAlign: 'center',
    maxRotation: 90,
    minRotation: 90
} as const;


declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof CScale> {}
}
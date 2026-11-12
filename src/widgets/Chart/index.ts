import { Chart } from "chart.js";
import { defineWidget, View } from "MWL@2026/modules/Widgets";

import {ScatterController, LineElement, PointElement, LineController, LinearScale} from 'chart.js';
import { ChartRenderer } from "Chart@2026/renderers/Chart";
import { LineModel } from "Chart@2026/models/datasets/Line";
Chart.register(ScatterController, LineElement, PointElement, LineController, LinearScale);

const ChartWidget = defineWidget(
    "w-chart",
    View({
        content: "<canvas w-id='canvas'></canvas>",
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            canvas: HTMLCanvasElement
        },
        setup() {

            const renderer = new ChartRenderer(this.elements.canvas);
            
            //TODO: type (GraphComponent)
            const line = new LineModel({
                        data : [{x: 0, y:0}, {x: 0.5, y: 1}, {x: 1, y:1}],
                        color: "blue",
                    });

            renderer.attach(line);

            //TODO: API (addLine + etc.)
            //TODO: listen to model...
            //TODO: update task...
            setTimeout( () => renderer.update(), 0);
        }
    })
);


type ChartWidget = InstanceType<typeof ChartWidget>;
export {ChartWidget};
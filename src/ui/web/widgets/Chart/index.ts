import { Chart as ChartJS} from "chart.js";
import { Coordinator, defineWidget, View } from "MWL@2026/modules/Widgets";

import {ScatterController, LineElement, PointElement, LineController, LinearScale} from 'chart.js';
import { ChartRenderer } from "Chart@2026/renderers/Chart";
import { Chart } from "Chart@2026/models/Chart";
import { observe } from "MWL@2026/modules/Observable";
ChartJS.register(ScatterController, LineElement, PointElement, LineController, LinearScale);

const ChartWidget = defineWidget(
    "w-chart",
    Coordinator(Chart), // TODO: API addLine, etc.
    View({
        content: "<canvas id='canvas'></canvas>",
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            canvas: HTMLCanvasElement
        },
        setup(chart) {

            const chartRenderer = new ChartRenderer(
                                                    this.elements.canvas,
                                                    chart
                                                );

            this.renderer.add( () => chartRenderer.update() );
            observe(chart, () => this.renderer.schedule() );
        }
    })
);


type ChartWidget = InstanceType<typeof ChartWidget>;
export {ChartWidget};
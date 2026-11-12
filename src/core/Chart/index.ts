import {defineWidget, View} from "MWL@2026/modules/Widgets";
import { observe } from "MWL@2026/modules/Observable";
import {ChartController} from "./Controller";

const ChartJS = defineWidget(
    "cjs-chart",
    View({
        content: "<canvas w-id='canvas'></canvas>",
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            canvas: HTMLCanvasElement
        },
        setup() {

            const ctrler = new ChartController(this.elements.canvas);

            //TODO: fetch initial HTML components...

            this.renderer.add( () => ctrler.update() );

            // we don't need a guard.
            observe( ctrler, () => this.renderer.schedule() );

            return ctrler;
        }
    })
);

export default ChartJS;
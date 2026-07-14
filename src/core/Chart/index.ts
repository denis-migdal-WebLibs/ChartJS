import defineWebComponent from "MWL@2026:DOM/WebComponent/defineWebComponent";
import { observe } from "MWL@2026:Reactive/Observers/observe";
import {ChartController} from "./Controller";

const ChartJS = defineWebComponent({
    name   : "cjs-chart",
    content: "<canvas data-wcid='canvas'></canvas>",
    style  : __LOAD_FILE__("./index.css"),
    elements: {
        canvas: HTMLCanvasElement
    },
    initialize() {

        const ctrler = new ChartController(this.elements.canvas);

        //TODO: fetch initial HTML components...

        this.renderer.add( () => ctrler.update() );

        // we don't need a guard.
        observe( ctrler, () => this.renderer.schedule() );

        return ctrler;
    }
});

export default ChartJS;
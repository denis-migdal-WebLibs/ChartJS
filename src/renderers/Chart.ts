import "Chart@2026/renderers/components";

import { Chart as ChartJS} from "chart.js";
import { ChartComponent } from "Chart@2026/models/components";

import { Renderer } from "Chart@2026/modules/renderers/@contract/@types";
import { getRenderer } from "Chart@2026/modules/renderers";
import { ArrayDelta, lazyRemove, stableCompact } from "Chart@2026/modules/ArrayDelta";
import { Chart } from "Chart@2026/models/Chart";
import { listen } from "MWL@2026/modules/Observable";

export class ChartRenderer {

    protected readonly canvas: HTMLCanvasElement;
    chartJS: ChartJS|null = null;

    protected readonly renderers        = new Array<Renderer>();
    protected readonly componentsDelta  = new ArrayDelta<ChartComponent>();

    constructor(target: HTMLCanvasElement, chart: Chart) {
        this.canvas = target;

        this.componentsDelta.recordInsertion(...chart.components.elements);

        listen(chart.components.insertionEvent, (component) => {
            this.componentsDelta.recordInsertion(component)
        });

        listen(chart.components.removalEvent, (component) => {
            this.componentsDelta.recordRemoval(component)
        });
    }

    // initial call must be made only after the canvas is connected...
    update() {

        this.ensureInit();

        let changed = this.executePendingOperations();

        for(let i = 0; i < this.renderers.length; ++i)
            if( this.renderers[i].update() )
                changed = true;

        if( changed )
            this.chartJS.update('none');
    }

    // should only be called AFTER ensureInit.
    protected executePendingOperations() {

        if( this.componentsDelta.isEmpty )
            return false;

        const removed = this.componentsDelta.removed;
        const added   = this.componentsDelta.added;

        // === removals ===

        if( removed.length !== 0) {

            for(let i = 0; i < removed.length; ++i) {
                const renderer = getRenderer(removed[i]);
                renderer.detach(this.chartJS!);
                lazyRemove(this.renderers, renderer);
            }

            stableCompact(this.renderers);
        }

        // === insertions ===

        // pre-allocate
        let offset = this.renderers.length;
        this.renderers.length += added.length;

        for(let i = 0; i < added.length; ++i) {
            const renderer = getRenderer(added[i]);
            renderer.attach(this.chartJS!);
            this.renderers[offset+i] = renderer;
        }

        this.componentsDelta.clear();

        return true;
    }

    protected ensureInit(): asserts this is {readonly chartJS: Chart} {

        if( this.chartJS !== null)
            return;

        this.chartJS = new ChartJS(this.canvas, {
            options: {
                locale: 'en-IN',
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {}
            },
            data: {
                datasets: []
            }
        });
    }
}
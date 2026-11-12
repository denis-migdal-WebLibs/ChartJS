import { Chart } from "chart.js";

//TODO: index.ts ?
import "Chart@2026/renderers/datasets/Dataset";
import "Chart@2026/renderers/datasets/Line";

import { LineModel } from "Chart@2026/models/datasets/Line";
import { getRenderer, Renderer } from "Chart@2026/renderers/core/defineRenderer";
import { NO_VALUE } from "MWL@2026/modules/@types";

//TODO: pas idéal...
type GraphComponent = LineModel;

//TODO: move into MWL
function stableRemoveIfFound<T>(target: T[], element: T) {
    const idx = target.indexOf(element);
    if( idx === -1)
        return false;

    target.splice(idx, 1);
    return true;
}

function lazyRemove<T>(target: T[], element: T) {
    const idx = target.indexOf(element);
    __ASSERT__(idx !== -1, "Element not found");

    target[idx] = NO_VALUE;
}
function stableCompact<T>(target: T[]) {

    const idx = target.indexOf(NO_VALUE);
    if( idx === -1) return;

    let offset = idx;
    for(let i = idx+1; i < target.length; ++i)
        if( target[i] !== NO_VALUE)
            target[offset++] = target[i];

    target.length = offset;
}

// @ts-expect-error
function stableRemove<T>(target: T[], element: T) {
    const idx = target.indexOf(element);
    __ASSERT__(idx !== -1, "Element not found");

    target.splice(idx, 1);
}

//END TODO

export class ChartRenderer {

    protected readonly canvas: HTMLCanvasElement;
    chartJS: Chart|null = null;

    constructor(target: HTMLCanvasElement) {
        this.canvas = target;
    }

    protected readonly renderers        = new Array<Renderer>();
    protected readonly pendingInsertion = new Array<GraphComponent>();
    protected readonly pendingRemoval   = new Array<GraphComponent>();

    attach(component: GraphComponent) {
        // remove then insert => do both to ensure a clean state.
        this.pendingInsertion.push(component);
    }
    detach(component: GraphComponent) {

        // insert then remove => delete pending operation.
        if( stableRemoveIfFound(this.pendingInsertion, component) )
            return;

        this.pendingRemoval.push(component);
    }

    // should only be called AFTER ensureInit.
    protected executePendingOperations() {

        if(    ! this.pendingInsertion.length
            && ! this.pendingRemoval.length )
            return false;

        // removals then insertions.

        // === removals ===
        for(let i = 0; i < this.pendingRemoval.length; ++i) {
            const renderer = getRenderer(this.pendingRemoval[i]);
            renderer.detach(this.chartJS!);
            lazyRemove(this.renderers, renderer);
        }
        if( this.pendingRemoval.length) {
            stableCompact(this.renderers);
            this.pendingRemoval.length = 0;
        }

        // === insertions. ===

        // pre-allocate
        let offset = this.renderers.length;
        this.renderers.length += this.pendingInsertion.length;

        for(let i = 0; i < this.pendingInsertion.length; ++i) {
            const renderer = getRenderer(this.pendingInsertion[i]);
            renderer.attach(this.chartJS!);
            this.renderers[offset+i] = renderer;
        }
        this.pendingInsertion.length = 0;

        return true;
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

    protected ensureInit(): asserts this is {readonly chartJS: Chart} {

        if( this.chartJS !== null)
            return;

        this.chartJS = new Chart(this.canvas, {
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
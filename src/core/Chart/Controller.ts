import { createEvent, Event } from "MWL@2026:Reactive/Event";
import { MAIN_EVENT, trigger } from "MWL@2026:Reactive/Observers/EventSource";
import { observeChanges, unobserve } from "MWL@2026:Reactive/Observers/observe";

import {Chart, ScatterController, LineElement, PointElement, LinearScale} from 'chart.js';
Chart.register(ScatterController, LineElement, PointElement, LinearScale);

//TODO: move
export type Component = {
    readonly [MAIN_EVENT]: Event<any>;

    attach: (binding: ComponentBinding) => void;
    detach: (binding: ComponentBinding) => void;
    update: (binding: ComponentBinding) => boolean;
}

export type ComponentBinding<T = any> = {
    chart      : ChartController,
    name       : string,
    component  : Component,
    context    : T
}

export class ChartController {

    // h4cky : is undefined until init.
    protected readonly canvas: HTMLCanvasElement;
    chartJS!: Chart;

    readonly [MAIN_EVENT] = createEvent(this);


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    protected readonly bindings = new Array<ComponentBinding>();

    // remove then insert = do both (ensure a clean state).
    // insert then remove = delete operations.
    protected readonly pendingRemoval   = new Array<ComponentBinding>();
    protected readonly pendingInsertion = new Array<ComponentBinding>();

    unregister(name: string) {

        const idx = this.bindings.findIndex( c => c.name === name );
        if( idx === -1 )
            throw new Error(`${name} isn't registered!`);

        const binding = this.bindings[idx];

        const pidx = this.pendingInsertion.indexOf(binding);
        if( pidx !== -1) {
            this.bindings        .splice( idx, 1);
            this.pendingInsertion.splice(pidx, 1);
            return;
        }

        this.bindings.splice(idx, 1); // order matter.
        this.pendingRemoval.push(binding);
    }

    register(name: string, component: Component) {

        if( this.find(name) !== null )
            throw new Error(`${name} is already registered!`);

        const binding = {
            chart: this,
            name,
            component,
            context: null,
        }

        this.bindings        .push(binding);
        this.pendingInsertion.push(binding);

        this.invalidate();
    }
    find<T extends Component>(name: string): T|null {
        // should still be fast as the array should be small.
        const result = this.bindings.find( c => c.name === name );

        if( result === undefined)
            return null;

        return result.component as T;
    }
    get<T extends Component>(name: string): T {
        const binding = this.find<T>(name);
        if( binding === null)
            throw new Error(`Component ${name} not found`);
        return binding;
    }

    protected readonly invalidateCallback = () => this.invalidate();

    protected invalidate(origin: unknown = null) {
        trigger(this, origin);
    }

    protected init() {
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

    update() {

        let changed =  this.chartJS === undefined
                    || this.pendingRemoval  .length !== 0
                    || this.pendingInsertion.length !== 0;

        if(this.chartJS === undefined)
            this.init();

        for(let i = 0; i < this.pendingRemoval.length; ++i) {
            const binding = this.pendingRemoval[i];
            binding.component.detach(binding);

            unobserve(binding.component, this.invalidateCallback);
        }
        this.pendingRemoval.length = 0;


        for(let i = 0; i < this.pendingInsertion.length; ++i) {
            const binding = this.pendingInsertion[i];
            binding.component.attach(binding);

            observeChanges(binding.component, this.invalidateCallback);
        }
        this.pendingInsertion.length = 0;

        for(let i = 0; i < this.bindings.length; ++i) {
            const binding = this.bindings[i];

            // we could also do it only if changed was notified by this
            // specific component.
            if( binding.component.update(binding) )
                changed = true;
        }

        if( changed )
            this.chartJS!.update('none');
    }
}

console.warn("ok")
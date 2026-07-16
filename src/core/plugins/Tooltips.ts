import { ChartController } from "Chart@2026:core/Chart/Controller";
import createComponentClass from "Chart@2026:core/createComponentClass";
import { Value } from "MWL@2026:Reactive/Properties/Controllers";
import { NULL_OP } from "MWL@2026:types";
import { updateProperties } from "MWL@2026:Reactive/Properties/createProperties";

import { Chart, ChartOptions, ChartType, ChartTypeRegistry, CoreInteractionOptions, InteractionMode, Tooltip, TooltipItem } from 'chart.js';

type TooltipOptions =
    NonNullable<NonNullable<ChartOptions["plugins"]>["tooltip"]> & {callbacks: NonNullable<NonNullable<NonNullable<ChartOptions["plugins"]>["tooltip"]>["callbacks"]>};

Chart.register(Tooltip);

type Direction = "x" | "xy" | "y";

type TooltipTitleCallback = (items: TooltipItem<keyof ChartTypeRegistry>[]) => string|null;
type TooltipTitle = null|string|TooltipTitleCallback;

type TooltipLabelCallback = (item: TooltipItem<keyof ChartTypeRegistry>) => string|null;
export type TooltipLabel = null|string|TooltipLabelCallback;

const Tooltips = createComponentClass({
    name       : "Tooltips",
    chartObject: () => {
        return {
            hover  : {
                mode     : "point" as InteractionMode,
                intersect: true
            } as Partial<CoreInteractionOptions>,
            tooltip: {
                enabled: true,

                titleFont: {
                    family: 'Courier New'
                },
                bodyFont: {
                    family: 'Courier New'
                },

                filter<TType extends ChartType>(item: TooltipItem<TType>) {

                    const point = item.parsed as any;
                    if( point.x === null || point.y === null )
                        return false;

                    let tooltip: TooltipLabel = (item.dataset as any).plugins?.tooltip;

                    // Well can't access real label as the callback is called
                    // after filtering...
                    if( typeof tooltip === "function")
                        tooltip = tooltip(item);
                    
                    if(   tooltip === undefined
                        || tooltip === null
                        || tooltip === "")
                        return false;

                    return true;
                },

                callbacks: {
                    title: NULL_OP,
                    label: (item: TooltipItem<keyof ChartTypeRegistry>) => {

                        let tooltip: TooltipLabel = (item.dataset as any).plugins?.tooltip;

                        if( typeof tooltip === "function")
                            tooltip = tooltip(item);

                        if( tooltip === undefined || tooltip === null )
                            return "";
                        
                        return tooltip;
                    }
                },

                mode: "point" as InteractionMode,
                intersect: true
            } as TooltipOptions
        }
    },
    properties: {
        direction: Value<Direction>("xy"),
        title    : Value<TooltipTitle>(null) 
    },
    bindings: {
        direction: (chartObject, value) => {
            let mode: InteractionMode | Direction = value;
            if( mode === "xy")
                mode = "point";

            chartObject.hover.mode      = chartObject.tooltip.mode      = mode;
            chartObject.hover.intersect = chartObject.tooltip.intersect = mode === "point";
        },
        title: (chartObject, title) => {
            // we don't care if we recreate a function at each update as tooltip
            // should not be updated frequently.
            if( title === null)
                chartObject.tooltip.callbacks.title = NULL_OP;
            else if( typeof title === "string")
                chartObject.tooltip.callbacks.title = () => title;
            else
                chartObject.tooltip.callbacks.title = (item) => {
                    const res = title(item);
                    if( res === null ) return;
                    return res;
                };
            }
    },
    attach: (binding) => {
        const options = binding.chart.chartJS.options;
        options.hover            = binding.context.chartObject.hover;
        options.plugins!.tooltip = binding.context.chartObject.tooltip;
    },
    detach: (binding) => {
        const options = binding.chart.chartJS.options;
        delete options.hover;
        delete options.plugins!.tooltip;
    }
});

export default Tooltips;

type TooltipsOptions = Partial<{
    direction: Direction,
    title    : TooltipTitle
}>;

declare module "../Chart/Controller" {
    interface ChartController {
        setTooltip(options: TooltipsOptions): ChartController;
    }
}

ChartController.prototype.setTooltip = function(options: TooltipsOptions) {

    const tooltip = this.find<InstanceType<typeof Tooltips>>("tooltip");

    if( tooltip === null) {
        this.register("tooltip", new Tooltips(options) );
    } else {
        updateProperties(tooltip, options);
    }
    return this;
}
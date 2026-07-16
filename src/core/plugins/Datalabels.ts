import { ChartController } from "Chart@2026:core/Chart/Controller";
import createComponentClass from "Chart@2026:core/createComponentClass";
import { Chart } from "chart.js";

import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

type DatalabelCallback = (value: {x: number, y: number}, context: Context) => string|null;

export type Datalabel = null|string|DatalabelCallback;

const Datalabels = createComponentClass({
    name       : "Datalabels",
    chartObject: () => {
        return {
            borderRadius: 4,
            font: { weight: 'bold' as const },
            color      : (_context: Context): string => {
                //TODO...
                return 'white';
            },
            backgroundColor: (context: Context): string => {
                // context.dataset.pointBackgroundColor ??
                return context.dataset.backgroundColor as string
                    ?? 'black';
            },
            formatter: (value: {x: number, y: number}, context: Context) => {
                let datalabel: Datalabel = (context.dataset as any).plugins.datalabel;

                if( typeof datalabel === "function")
                        datalabel = datalabel(value, context);

                if(    datalabel === undefined
                    || datalabel === null
                    || datalabel === "")
                    return null;
                
                return datalabel;
            }
            //TODO: onHover/onClick
        }
    },
    properties: {
    },
    bindings: {
    },
    attach: (binding) => {
        binding.chart.chartJS.options.plugins!.datalabels = binding.context.chartObject;
    },
    detach: (binding) => {
        delete binding.chart.chartJS.options.plugins!.datalabels;
    }
});

export default Datalabels;

// =================== PLUGIN =========================
declare module "../Chart/Controller" {
    interface ChartController {
        setDatalabels(): ChartController;
    }
}

ChartController.prototype.setDatalabels = function() {

    const zoom = this.find<InstanceType<typeof Datalabels>>("datalabels");

    if( zoom === null) {
        this.register("datalabels", new Datalabels() );
    } else {
        
    }
    return this;
}
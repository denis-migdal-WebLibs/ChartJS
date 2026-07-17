import createComponentClass from "Chart@2026:core/createComponentClass";
import { Value } from "MWL@2026:Reactive/Properties";
import { Chart } from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";
import { ChartController } from "../Chart/Controller";
Chart.register(zoomPlugin);

type ZoomDirection = "x" | "y" | "xy";

const Zoom = createComponentClass({
    name       : "Zoom",
    chartObject: {
        zoom: {
            mode: "xy" as ZoomDirection,
            wheel: {
                enabled: true
            }
        },
        pan: {
            mode: "xy" as ZoomDirection,
            enabled: true
        }
    },
    properties: {
        direction: Value<ZoomDirection|false>("xy")
    },
    bindings: {
        direction: (cfg, direction) => {
            cfg.pan.enabled = cfg.zoom.wheel.enabled = direction !== false;
            if( direction !== false)
                cfg.pan.mode = cfg.zoom.mode = direction;
        }
    },
    attach: (binding) => {
        binding.chart.chartJS.options.plugins!["zoom"] = binding.context.chartObject;
    },
    detach: (binding) => {
        delete binding.chart.chartJS.options.plugins!["zoom"];
    }
});

export default Zoom;

// =================== PLUGIN =========================
declare module "../Chart/Controller" {
    // no addZoom/createZoom.
    interface ChartController {
        resetZoom(): ChartController
        setZoom(dir: ZoomDirection): ChartController
    }
}


ChartController.prototype.resetZoom = function() {
    this.chartJS.resetZoom();
    return this;
}

ChartController.prototype.setZoom = function(direction: ZoomDirection) {

    const zoom = this.find<InstanceType<typeof Zoom>>("zoom");

    if( zoom === null) {
        this.register("zoom", new Zoom({direction}) );
    } else {
        zoom.properties.direction = direction;
    }
    return this;
}
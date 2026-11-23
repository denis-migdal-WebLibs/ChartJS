import { Chart } from "Chart@2026/models/Chart";
import { ChartRenderer } from "Chart@2026/renderers/Chart";

import {Chart as ChartJS} from "chart.js";
import {ScatterController, LineElement, PointElement, LineController, LinearScale} from 'chart.js';
ChartJS.register(ScatterController, LineElement, PointElement, LineController, LinearScale);

// @ts-ignore
import {Canvas} from "canvas";

export class ChartImage {

    readonly subject = new Chart();

    readonly renderer: ChartRenderer;
    readonly canvas  : Canvas;

    //TODO: canvas...
    constructor(w: number, h: number) {
        this.canvas   = new Canvas(w, h);
        this.renderer = new ChartRenderer(this.canvas, this.subject);
    }

    async draw() {
        this.renderer.update();
        return await this.canvas.toBuffer()
    }
}
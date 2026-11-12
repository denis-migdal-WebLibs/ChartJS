import { Chart } from "chart.js";

export type LifeCycle<CO> = {
    attach(target: Chart, chartObject: CO): void,
    detach(target: Chart, chartObject: CO): void,
}
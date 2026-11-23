import type { Chart, ChartDataset, ChartTypeRegistry } from "chart.js";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";

export type Klass  <T extends object> = {new(...args: any[]): T};
export type Factory<T extends object> = () => T;

export type LifeCycle<CO> = {
    attach(target: Chart, chartObject: CO): void,
    detach(target: Chart, chartObject: CO): void,
}

export type Renderer = {
    attach(target: Chart): void;
    detach(target: Chart): void;
    update(): boolean;
};

export type RendererProvider = (model: Properties<any>) => Renderer;

export type ObjectUpdaterFactory<
                    T extends Record<string, any>,
                    O extends object
                > = (object: O, data: Properties<T>) => () => boolean;

export type DatasetObject = {
    [K in keyof ChartTypeRegistry]: ChartDataset<K>
}[keyof ChartTypeRegistry];
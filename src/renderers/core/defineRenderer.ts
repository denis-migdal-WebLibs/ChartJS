import { Chart } from "chart.js";
import { LifeCycle } from "./LifeCycle";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";

export type Klass  <T extends object> = {new(...args: any[]): T};
export type Factory<T extends object> = () => T;

// =====

function setInternal(target: object, key: symbol, value: unknown) {
    (target as any)[key] = value;
}
function getInternal<T>(target: object, key: symbol): T {
    __ASSERT__( key in target, "Internal value not found");
    return (target as any)[key];
}
function findInternal<T>(target: object, key: symbol): T|null {
    const result = (target as any)[key];
    if( result === undefined)
        return null;

    return result;
}

// @ts-expect-error
function hasInternal(target: object, key: symbol) {
    return key in target;
}

// =====

export type Renderer = {
    attach(target: Chart): void;
    detach(target: Chart): void;
    update(): boolean;
};
type RendererProvider = (model: any) => Renderer;

const RENDERER_PROVIDER = Symbol();
function registerRendererProvider(
                            target: Klass<object>,
                            provider: RendererProvider
                        ) {
    setInternal(target, RENDERER_PROVIDER, provider);
}
function getRendererProvider(target: object) {
    return getInternal<RendererProvider>(
                                        target.constructor,
                                        RENDERER_PROVIDER
                                    );
}

const RENDERER = Symbol();

export function getRenderer(target: object): Renderer {
    
    let renderer = findInternal<Renderer>(target, RENDERER);

    if( renderer === null) {
        const provider = getRendererProvider(target);
        renderer = provider(target);
        setInternal(target, RENDERER, renderer);
    }

    return renderer;
}

export type ChartObjectUpdaterFactory<
                                T extends Record<string, any>,
                                CO extends object
                            > = (chartObject: CO, data: Properties<T>)
                                                            => () => boolean;

export function defineRenderer<
                                    T extends Record<string, any>,
                                    CO extends object
                                >(
   Model             : Klass<Properties<T>>,
   ChartObject       : Factory<CO>,
   ChartObjectUpdater: ChartObjectUpdaterFactory<T, CO>,
   lifeCycle         : LifeCycle<CO>,
) {

    registerRendererProvider(Model, (model: Properties<T>) => {
        
        const chartObject = ChartObject();
        const update      = ChartObjectUpdater(chartObject, model);

        return {
            attach(chartJS) {
                lifeCycle.attach(chartJS, chartObject);
            },
            detach(chartJS) {
                lifeCycle.detach(chartJS, chartObject);
            },
            update,
        }
    });

    return {

    };
}
import { Cstr } from "MWL@2026:types";
import {ChartController, Component } from "./Chart/Controller";

export type WithComponent<T extends Cstr<Component> & {name: string}> = 
  Record<`create${T["name"]}`, (name: string, ...args: ConstructorParameters<T>) => InstanceType<T>>
& Record<`add${T["name"]}`   , (name: string, ...args: ConstructorParameters<T>) => ChartController>;

//TODO move + type guard.
//: asserts Klass is AugmentCtor<T, Record<K, M>>
function addMethod<T extends Cstr<any>>(Klass : T,
                                        key   : string|symbol,
                                        method: (this: InstanceType<T>, ...args:any[]) => any
                                    ) {
    // @ts-ignore
    Klass[key] = method;
}

export default function registerComponent<T extends Cstr<Component, any> & {name: string} >(Klass: T) {

    addMethod(ChartController, `create${Klass.name}`, function(name: string, ...args) {
        const dataset = new Klass(...args);
        this.register(name, dataset);
        return dataset;
    });

    addMethod(ChartController, `add${Klass.name}`, function(name: string, ...args: any[]) {
        // @ts-ignore
        this[`create${Klass.name}`](name, ...args as any);
        return this;
    })
}
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Constant, Value } from "MWL@2026/modules/Reactive/Property";
import { Dataset } from "./Dataset";
import { Chart as _Chart } from "../../Chart";
import { Cstr } from "MWL@2026/modules/@types";

const Line = Properties({
    ...Dataset.Descriptors,
    type      : Constant<"scatter">("scatter"),
    showPoints: Value   <boolean>  (false),
});

type Line = InstanceType<typeof Line>;
export {Line};

/* test */
export type WithComponent<NAME extends string, T extends Cstr<any>> = 
  Record<`create${NAME}`, (...args: ConstructorParameters<T>) => InstanceType<T>>
& Record<`add${NAME}`   , (...args: ConstructorParameters<T>) => _Chart>;

function addMethod<T extends Cstr<any>>(Klass : T,
                                        key   : string|symbol,
                                        method: (this: InstanceType<T>, ...args:any[]) => any
                                    ) {
    Klass.prototype[key] = method;
}

export default function registerComponent<T extends Cstr<any, any>>(name: string, Klass: T) {

    addMethod(_Chart, `create${name}`, function(...args) {
        const dataset = new Klass(...args);
        this.components.add(dataset);
        return dataset;
    });

    addMethod(_Chart, `add${name}`, function(...args: any[]) {
        // @ts-expect-error
        this[`create${name}`](...args as any);
        return this;
    })
}

registerComponent("Line", Line);
declare module "../../Chart" {
    interface Chart extends WithComponent<"Line", typeof Line> {}
}
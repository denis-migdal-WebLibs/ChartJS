import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Affixed } from "MWL@2026/modules/Reactive/Property";
import type { ChartComponent } from "./components";
import { ReactiveList } from "Chart@2026/modules/collections/ReactiveList";

const _Chart = class extends Properties({
    components: Affixed(ReactiveList<ChartComponent>)
}) {

    addComponent(elem: ChartComponent) {
        this.components.add(elem);
    }

    removeComponent(elem: ChartComponent) {
        this.components.remove(elem);
    }
};

// allows declarations merging
interface Chart extends InstanceType<typeof _Chart> {}

// required to take the declaration merging into account.
const Chart: new(...args: ConstructorParameters<typeof _Chart>) => Chart = _Chart as any;

export {Chart};
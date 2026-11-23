import { NULL_ARRAY } from "MWL@2026/modules/@types";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Line } from "./Line";
import { Computed, Constant, Value } from "MWL@2026/modules/Reactive/Property";

const HLine = Properties({
        ...Line.Descriptors,
        data      : Value<number|null>(null),
        // /!\ il faut préciser le type dans le calcul.
        parsedData: Computed(["data"], (value: number|null) => { return [{x: 0, y: value!}, {x: 1, y: value!}] }),
        showPoints: Constant<boolean>(false),
    });

type HLine = InstanceType<typeof HLine>;
export {HLine};


class ValueConverter {

    readonly cache = [
                        {x: Number.NEGATIVE_INFINITY, y: 0},
                        {x: Number.POSITIVE_INFINITY, y: 0}
                    ];

    convert(data: null|number) {

        if(data === null)
            return NULL_ARRAY;

        this.cache[0].y = data;
        this.cache[1].y = data;

        return this.cache;
    }
}

void ValueConverter;
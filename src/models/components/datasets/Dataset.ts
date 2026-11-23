import { ChartType } from "chart.js";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Value, Computed } from "MWL@2026/modules/Reactive/Property";
import { FCT_ID } from "MWL@2026/modules/@types";

//TODO...
export type ParsedData = readonly {x: number, y: number}[];

/*
type RawData    = ParsedData;

class ValueConverter {

    readonly cache = [];

    convert( rawData: RawData ) {
        //TODO...
        return rawData;
    }
}
/**/

//TODO: more complex parser...
const Dataset = Properties({
    type      : Value<ChartType>("scatter"),
    data      : Value<ParsedData>([]),
    parsedData: Computed(["data"], FCT_ID<ParsedData>),
    color     : Value("black"),
/*
    tooltip  : Value<TooltipLabel>(null),
    datalabel: Value<Datalabel>(null),
*/
});

type Dataset = InstanceType<typeof Dataset>;
export {Dataset};
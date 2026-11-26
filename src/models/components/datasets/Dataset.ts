import { ChartType } from "chart.js";
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Value, Computed } from "MWL@2026/modules/Reactive/Property";
import { CurveParser, RawDataPoints } from "./@core/CurveParser";

//TODO: more complex parser...
const Dataset = Properties({
    type      : Value<ChartType>("scatter"),
    data      : Value<RawDataPoints>([]),
    parsedData: Computed(["data"], CurveParser),
    color     : Value("black"),
/*
    tooltip  : Value<TooltipLabel>(null),
    datalabel: Value<Datalabel>(null),
*/
});

type Dataset = InstanceType<typeof Dataset>;
export {Dataset};
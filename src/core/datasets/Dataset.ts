import { Signal, Value, View } from "MWL@2026:Reactive/Properties/Controllers";
import { createDatasetClass } from "./core";
import { ChartType } from "chart.js";

/*
type Data<D extends any> = {
    x        : string, "x"
    y        : string, "y"

    tooltip  : TooltipLabel, null
    datalabel: Datalabel, null

    monotone : boolean // seems bugged.
    // dataset.cubicInterpolationMode = "monotone";
}
*/

export type ParsedData = readonly {x: number, y: number}[];
type RawData    = ParsedData;

class ValueConverter {

    readonly cache = [];

    convert( rawData: RawData ) {
        //TODO...
        return rawData;
    }
}

const Dataset = createDatasetClass({
    name: "Dataset",
    properties: {
        type      : Value<ChartType>("scatter"),
        data      : Signal<ParsedData>([]),
        parsedData: View("data", ValueConverter),
        //parsedData: Computed( (properties: {data: ParsedData}) => properties.data),
        color     : Value<string>("black"),
    },
    bindings  : {
        type : (dataset, type) => {
            dataset.type = type;
        },
        parsedData: (dataset, parsedData) => {
            dataset.data = parsedData as any; // ChartJS requires it to be RW.
        },
        color: (dataset, color) => {
            dataset.borderColor = dataset.backgroundColor = color;
        }
    }
});

export default Dataset;

/*

type DatasetExtra = {
    tooltip  ?: TooltipLabel,
    datalabel?: Datalabel
}

export type RawDataset    = number[]|[number, number][]|ParsedDataset;

type DataParser<D extends any> = (raw: D, target: ParsedDataset) => ParsedDataset;

function isParsed(data: RawDataset): data is ParsedDataset {
    return data.length === 0 || typeof data[0] === "object" && ! Array.isArray(data[0]);
}

function isPoints(data: RawDataset): data is [number,number][] {
    return Array.isArray(data[0]);
}

export function rawParser(data  : RawDataset,
                          prev  : ParsedDataset) {
    
    if( isParsed(data) )
        return data;

    const isPts = isPoints(data);

    // reuse previous data.
    const target = prev;

    if( data.length < target.length)
        target.length = data.length;

    let i;
    if( isPts ) {
        for(i = 0; i < target.length; ++i) {
            target[i].x = data[i][0]
            target[i].y = data[i][1]
        }
    } else {
        for(i = 0; i < target.length; ++i) {
            target[i].x = i
            target[i].y = data[i];
        }
    }

    if( target.length === data.length )
        return target;
    
    target.length = data.length;

    if( isPts )
        for( ; i < target.length; ++i)
            target[i] = {x: data[i][0], y: data[i][1]}
    else
        for( ; i < target.length; ++i)
            target[i] = {x: i, y: data[i]};

    return target;
}

export function updateDataset<D extends any>(data      : Data<D>,
                                             internals : Internal<D>,
                                             dataParser: DataParser<D>) {

    const dataset = internals.dataset;

    dataset.xAxisID = data.x;
    dataset.yAxisID = data.y;

    dataset.label = data.name;

    internals.dataset.tooltip   = data.tooltip;
    internals.dataset.datalabel = data.datalabel;
}

export default Dataset;
*/
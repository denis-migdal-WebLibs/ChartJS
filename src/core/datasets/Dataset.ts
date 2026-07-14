import { Signal, Value } from "MWL@2026:Reactive/Properties/Controllers";
import { createDatasetClass } from "./core";
import { ChartType } from "chart.js";

/*
type Data<D extends any> = {
    name     : string|null,
    x        : string,
    y        : string,
    data     : D,
    tooltip  : TooltipLabel,
    datalabel: Datalabel,
    monotone : boolean
}
*/

type ParsedData = readonly {x: number, y: number}[];

// -> changer le type to keep real ?
export const DatasetProperties = {
    type      : Value<ChartType>("scatter"),
    parsedData: Signal<ParsedData>([]),
    color     : Value<string>("black"),
    data      : Value<string>("ok")
};

const Dataset = createDatasetClass({
    name: "Dataset",
    properties: DatasetProperties,
    bindings  : {
        type : (dataset, type) => {
            dataset.type = type;
        },
        data: (_dataset, _data, ok: {color: string}) => {
            ok.color
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

//TODO: derive (? - mixing ?).

// => baseDataset (ou autre).

// deriveDataset(target, {
//     props,
//     bindings,
//     createDataset(?)
// })

/*
createDatasetClass({
        properties: {
            // ...
        },
        bindings  : {
            // ...
        },
        createDataset() {
            //TODO...
        }
    })
*/

// ========================

/*
import { ChartDataset } from "chart.js";
import createComponentClass from "../impl/createComponentClass";
import { TooltipLabel } from "../Tooltips/DefaultTooltipSystem";
import { Datalabel    } from "../Datalabels/DefaultDatalabelSystem";

type DatasetExtra = {
    tooltip  ?: TooltipLabel,
    datalabel?: Datalabel
}

export type ParsedDataset = {x: number, y: number}[];
export type RawDataset    = number[]|[number, number][]|ParsedDataset;

const Dataset = createComponentClass({
    name          : "Dataset",
    properties: {
        name   : null as string|null,
        type   : "scatter",
        color  : "black",
        data   : [] as RawDataset,
        x      : "x",
        y      : "y",
        monotone : false, 
        tooltip  : null as TooltipLabel,
        datalabel: null as Datalabel
    },
    cstrArgsParser: (opts, data: RawDataset) => {
        opts.data = data;
    },
    createInternalData() {
        return {
            prevData: null as any,
            dataset : {} as ChartDataset<any> & DatasetExtra,
        }
    },
    onUpdate(data, internals) {
        internals.dataset.type = data.type;
        updateDataset(data, internals, rawParser);
    },
});

type Internal<D extends any> = {
    dataset : ChartDataset<any> & DatasetExtra,
    prevData: D
}

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

    dataset.borderColor = dataset.backgroundColor = data.color;

    internals.dataset.tooltip   = data.tooltip;
    internals.dataset.datalabel = data.datalabel;

    if( data.monotone === true) {
        // bugged ? doesn't print lines.
        //(internals.dataset as ChartDataset<"scatter">).cubicInterpolationMode = "monotone";
    } else
        delete internals.dataset.cubicInterpolationMode;

    // recomputing data might be costly...
    if( internals.prevData !== data.data) {
        internals.prevData = data.data;
        dataset.data = dataParser(data.data, dataset.data);
    }
}

export default Dataset;
*/
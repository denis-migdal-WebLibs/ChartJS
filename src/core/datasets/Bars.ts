import { createDatasetClass } from './core';
import Dataset from './Dataset';
import { Constant } from 'MWL@2026:Reactive/Properties';
import { WithComponent } from 'Chart@2026:core/registerComponent';

import {Chart, BarController, BarElement} from 'chart.js';
Chart.register(BarElement, BarController);

const Bars = createDatasetClass({
    name         : "Bars",
    chartObject  : {
        borderWidth       : 0,
        barPercentage     : 1,
        categoryPercentage: 1,
        // for linear scale ?
        grouped   : false,
        // dataset.barThickness = "flex"; // not working properly ?
        parsing   : false,
        normalized: true
    },
    properties: {
        ...Dataset.properties,
        type      : Constant<"bar">("bar"),
        //reversed  : Value<boolean>(false), - TODO... (y * -1)
        // => computed/adapter (2 values, not just 1...).
    },
    bindings: {
        ...Dataset.bindings,
    },
});

declare module "../Chart/Controller" {
    interface ChartController extends WithComponent<typeof Bars> {}
}

export default Bars;

/*

function reversedParser(data: RawDataset, prev: ParsedDataset) {
    const line = rawParser(data, prev);
    if( line === data)
        throw new Error("Not implemented yet");
    for(let i = 0; i < line.length; ++i)
        line[i].y *= -1;
    return line;
}*/
import {Chart} from "Chart@2026:core/";

import { createPropertiesFactory } from "MWL@2026:exports/Reactive/Properties";
import { Value, View } from "MWL@2026:exports/Reactive/Properties/controllers";

import { listen } from "MWL@2026:exports/Reactive/Events";
import { getProperty, syncProperty, unsyncProperty } from "MWL@2026:exports/Reactive/Properties/sync";

// ====

class Converter {
    convert(value: number) {
        return -1 * value;
    }
}

const factory = createPropertiesFactory({
    test: Value(0),
    view: View("test", Converter)
});

const A = factory({test: 1});
const B = factory({test: 2});

listen(B, () => {
    console.warn("B changed", B.test);
});

A.test = 3;

syncProperty( getProperty(A, "view"),
              getProperty(B, "test")
            );

console.warn( getProperty(B, "test") );

console.warn("=== start ===");
A.test = 4;
console.warn("=== end ===");
B.test = 5;

console.warn("=== unsync ===");

unsyncProperty( getProperty(A, "view"),
                getProperty(B, "test")
            );

A.test = 6;

console.warn("B", B.test);

// ====


const chart = new Chart();

chart.api.addHLine("name2", {data: 0.5})
         .addLinearScale("x", {min: 0, max: 10});

chart.api.setZoom("xy")
         .setDatalabels();

chart.api.setTooltip({title: "Coucou"});

const pts = chart.api.createPoints("name", {
    color : "blue",
    data  : [{x: 0, y:0}, {x: 0, y:0}, {x: 1, y:1}],
    tooltip: "pts",
    datalabel: "43",
});

let i = 0;
setInterval( () => {
    ++i;
    let data = pts.properties.data;
    data[1].x = data[1].y = (i/10)%1;
    pts.properties.data = data; // force change...
    //line.properties.color = colors[i%2];
}, 1000);

/*
import Dataset from "Chart@2026:core/datasets/Dataset";
const line = new Dataset({
    parsedData: [{x: 0, y:0}, {x: 0, y:0}, {x: 1, y:1}],
});

chart.api.register("line", line);

//let colors = ["red", "blue"]
let i = 0;
setInterval( () => {
    ++i;
    let data = line.properties.parsedData;
    data[1].x = data[1].y = (i/10)%1;
    line.properties.parsedData = data; // force change...
    //line.properties.color = colors[i%2];
}, 1000);

*/
/* 
//TODO...
chart.addLine({color: "red", data: [[0,0], [1,1]] as const});
const line = chart.createLine({color: "red", data: [[1,0], [0,1]] as const});

chart.addScale('y', {labels: ["ok", "nok"]});

line.properties.color = "blue";

let i = 0;

// chart.update(); // do not need if becoming visible...

*/

document.body.append(chart);
import {Chart} from "Chart@2026:core/";

const chart = new Chart();

chart.api.addLine("name", {
    color     : "blue",
    parsedData: [{x: 0, y:0}, {x: 0, y:0}, {x: 1, y:1}]
});

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
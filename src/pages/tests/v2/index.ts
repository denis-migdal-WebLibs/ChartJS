import {ChartWidget} from "Chart@2026/widgets/Chart/";


const chart = new ChartWidget();

/*
chart.api.addLine({
                    data : [{x: 0, y:0}, {x: 0.5, y: 1}, {x: 1, y:1}],
                    color: "blue",
                });
*/

document.body.append(chart);
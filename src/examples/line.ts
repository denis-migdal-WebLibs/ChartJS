import { Line } from "Chart@2026/models";
import { Chart } from "Chart@2026/models/Chart";
import { HLine } from "Chart@2026/models/components/datasets/HLine";

export default function(chart: Chart) {

    const hline = new HLine({data: 0.75});

    chart.components.add(hline);

    chart.addLine({
        data : [{x: 0, y:1}, {x: 0.5, y: 1}, {x: 1, y:0}],
        color: "red",
    });

    const line = new Line({
        data : [{x: 0, y:0}, {x: 0.5, y: 1}, {x: 1, y:1}],
        color: "blue",
    });

    line.color = "green";

    chart.addComponent(line);
}
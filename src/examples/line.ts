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


export type ParsedData = {x: number, y: number}[];
export type RawData    = number[]|[number, number][]|ParsedData;


function isParsed(data: RawData): data is ParsedData {
    return data.length === 0 || typeof data[0] === "object" && ! Array.isArray(data[0]);
}

function isPoints(data: RawData): data is [number,number][] {
    return Array.isArray(data[0]);
}

class X {
    private parsed: ParsedData = new Array();

    parse(data: RawData): ParsedData {

        if( isParsed(data) ) {
            this.parsed.length = 0;
            return data;
        }

        this.resize(data.length);

        if( isPoints(data) )
            this.fillFromPoints(data);
        else
            this.fillFromSequence(data);

        return this.parsed;
    }

    protected resize(nb: number) {

        if( nb < this.parsed.length) {
            this.parsed.length = nb;
            return;
        }

        if( nb > this.parsed.length) {
            const origSize = this.parsed.length;
            this.parsed.length = nb;
            for(let i = origSize; i < this.parsed.length; ++i)
                this.parsed[i] = {x: 0, y: 0};
        }
    }

    protected fillFromPoints(points: readonly [number, number][]) {
        for(let i = 0; i < points.length; ++i) {
            this.parsed[i].x = points[i][0];
            this.parsed[i].y = points[i][1];
        }
    }

    protected fillFromSequence(sequence: readonly number[]) {
        for(let i = 0; i < sequence.length; ++i) {
            this.parsed[i].x = i;
            this.parsed[i].y = sequence[i];
        }
    }
}

void X;
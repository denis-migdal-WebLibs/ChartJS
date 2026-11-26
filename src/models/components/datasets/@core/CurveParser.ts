import type { Calculator } from "MWL@2026/modules/Reactive/Property";
import type { Mutable } from "MWL@2026/modules/@types";

export type ParsedData = readonly {x: number, y: number}[];
export type SoAData    = {x: ArrayLike<number>, y: ArrayLike<number>};
export type RawData    = number[]|[number, number][]|ParsedData|SoAData;

function isParsed(data: RawData): data is ParsedData {

    if( ! Array.isArray(data)) // SoA.
        return false;

    if( data.length === 0 )
        return true;

    return typeof data[0] === "object" && ! Array.isArray(data[0]);
}

function isPoints(data: number[]|[number, number][]): data is [number,number][] {
    return Array.isArray(data[0]);
}


export class CurveParser implements Calculator<[RawData], ParsedData> {

    private allocationCache: Mutable<ParsedData> = [];

    compute(rawData: RawData) {

        if( isParsed(rawData) ) {
            this.allocationCache.length = 0;
            return rawData;
        }

        if( ! Array.isArray(rawData) ) {

            this.realloc(rawData.x.length);
            this.fillFromSoA(rawData);

            return this.allocationCache;
        }

        this.realloc(rawData.length);

        if( isPoints(rawData) )
            this.fillFromPoints(rawData);
        else
            this.fillFromSequence(rawData);

        return this.allocationCache;
    }

    protected realloc(nb: number) {

        if( nb < this.allocationCache.length) {
            this.allocationCache.length = nb;
            return;
        }

        if( nb > this.allocationCache.length) {
            const origSize = this.allocationCache.length;
            this.allocationCache.length = nb;
            for(let i = origSize; i < this.allocationCache.length; ++i)
                this.allocationCache[i] = {x: 0, y: 0};
        }
    }

    protected fillFromSoA(soa: SoAData) {
        for(let i = 0; i < soa.x.length; ++i) {
            this.allocationCache[i].x = soa.x[i];
            this.allocationCache[i].y = soa.y[i];
        }
    }

    protected fillFromPoints(points: readonly [number, number][]) {
        for(let i = 0; i < points.length; ++i) {
            this.allocationCache[i].x = points[i][0];
            this.allocationCache[i].y = points[i][1];
        }
    }

    protected fillFromSequence(sequence: readonly number[]) {
        for(let i = 0; i < sequence.length; ++i) {
            this.allocationCache[i].x = i;
            this.allocationCache[i].y = sequence[i];
        }
    }
}
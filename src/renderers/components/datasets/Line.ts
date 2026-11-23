import { Line } from "Chart@2026/models/components";
import { defineDatasetRenderer } from "Chart@2026/modules/renderers";
import { ObjectTemplate, ObjectUpdater } from "Chart@2026/modules/object";
import { ChartDataset } from "chart.js";
import { DatasetEffects, DatasetTemplateObject } from "./Dataset";
import { PropertiesShape } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

export type LineDataset = ChartDataset<"scatter">;
export type LineData    = PropertiesShape<Line>;

export const LineTemplateObject = {
        ...DatasetTemplateObject,
        showLine   : true,
        borderWidth: 2,
        parsing    : false as const,
        normalized : true
    }

export const LineEffects = {
        ...DatasetEffects,
        showPoints(dataset: LineDataset, showPoints: boolean) {
            if( showPoints )
                delete dataset.pointRadius;
            else
                dataset.pointRadius = 0;
        }
    };

defineDatasetRenderer( Line,
    ObjectTemplate<LineDataset>(LineTemplateObject),
    ObjectUpdater<LineData, LineDataset>(LineEffects)
);
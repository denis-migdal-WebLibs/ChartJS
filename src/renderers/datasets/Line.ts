import { LineModel } from "Chart@2026/models/datasets/Line";
import { defineDatasetRenderer } from "../core/defineDatasetRenderer";
import { ObjectTemplate } from "../core/ObjectTemplate";
import { ChartDataset } from "chart.js";
import { ChartObjectUpdater } from "../core/ChartObjectUpdater";
import { DatasetEffects, DatasetTemplateObject } from "./Dataset";
import { PropertiesShape } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

type LineDataset = ChartDataset<"scatter">;
type LineData    = PropertiesShape<LineModel>;

defineDatasetRenderer( LineModel,
    ObjectTemplate<LineDataset>({
        ...DatasetTemplateObject,
        showLine   : true,
        borderWidth: 2,
        parsing    : false,
        normalized : true
    }),
    ChartObjectUpdater<LineData, LineDataset>({
        ...DatasetEffects,
        showPoints(dataset, showPoints) {
            if( showPoints )
                delete dataset.pointRadius;
            else
                dataset.pointRadius = 0;
        }
    })
);
import { DatasetModel, ParsedData } from "Chart@2026/models/datasets/Datasets";
import { ObjectTemplate } from "../core/ObjectTemplate";
import { DatasetObject, defineDatasetRenderer } from "../core/defineDatasetRenderer";
import { ChartObjectUpdater } from "../core/ChartObjectUpdater";
import { mutable } from "MWL@2026/modules/@types";
import { ChartTypeRegistry, Point } from "chart.js";

export const DatasetEffects = {
    type (dataset: DatasetObject, type: keyof ChartTypeRegistry) {
        dataset.type = type;
    },
    color(dataset: DatasetObject, color: string) {
        dataset.borderColor = dataset.backgroundColor = color;
    },
    parsedData(dataset: DatasetObject, parsedData: ParsedData) {
        // ChartJS requires it to be RW.
        dataset.data = mutable(parsedData);
    }
};

export const DatasetTemplateObject = {
    data: [] as Point[]
}

defineDatasetRenderer( DatasetModel,
    ObjectTemplate    (DatasetTemplateObject),
    ChartObjectUpdater(DatasetEffects)
);
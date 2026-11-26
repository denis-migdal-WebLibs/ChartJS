import { Dataset, ParsedDataPoints } from "Chart@2026/models/components";
import { ObjectTemplate, ObjectUpdater } from "Chart@2026/modules/object/";
import { defineDatasetRenderer } from "Chart@2026/modules/renderers";
import { DatasetObject } from "Chart@2026/modules/renderers/@contract/@types";
import { mutable } from "MWL@2026/modules/@types";
import { ChartTypeRegistry, Point } from "chart.js";

export const DatasetEffects = {
    type (dataset: DatasetObject, type: keyof ChartTypeRegistry) {
        dataset.type = type;
    },
    color(dataset: DatasetObject, color: string) {
        dataset.borderColor = dataset.backgroundColor = color;
    },
    parsedData(dataset: DatasetObject, parsedData: ParsedDataPoints) {
        // ChartJS requires it to be RW.
        dataset.data = mutable(parsedData);
    }
};

export const DatasetTemplateObject = {
    data: [] as Point[]
}

defineDatasetRenderer( Dataset,
    ObjectTemplate(DatasetTemplateObject),
    ObjectUpdater (DatasetEffects)
);
import { HLine } from "Chart@2026/models/components/datasets/HLine";
import { ObjectTemplate, ObjectUpdater } from "Chart@2026/modules/object";
import { defineDatasetRenderer } from "Chart@2026/modules/renderers";
import { LineDataset, LineEffects, LineTemplateObject } from "./Line";
import { PropertiesShape } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

export type HLineData    = PropertiesShape<HLine>;

defineDatasetRenderer( HLine,
    ObjectTemplate<LineDataset>(LineTemplateObject),
    ObjectUpdater<HLineData, LineDataset>(LineEffects)
);
import { Properties } from "MWL@2026/modules/Reactive/Collections/Properties";
import { Constant, Value } from "MWL@2026/modules/Reactive/Property";
import { DatasetModel } from "./Datasets";

const LineModel = Properties({
    ...DatasetModel.Descriptors,
    type      : Constant<"scatter">("scatter"),
    showPoints: Value   <boolean>  (false),
});

type LineModel = InstanceType<typeof LineModel>;
export {LineModel};
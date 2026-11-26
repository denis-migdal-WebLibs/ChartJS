
import { Dataset } from "./Dataset";
import { Line } from "./Line";
import { HLine } from "./HLine";

export {
    Dataset,
    Line,
    HLine,
};

export type {ParsedDataPoints} from "./@core/CurveParser";

//TODO: idéalement le calculer...
export type DatasetComponent = Dataset|Line|HLine;
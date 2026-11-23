
import { Dataset } from "./Dataset";
import { Line } from "./Line";
import { HLine } from "./HLine";

export {
    Dataset,
    Line,
    HLine,
};

export {ParsedData} from "./Dataset";

//TODO: idéalement le calculer...
export type DatasetComponent = Dataset|Line|HLine;
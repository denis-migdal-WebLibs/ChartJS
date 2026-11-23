import { ReactiveList } from "./@types";

export interface ReactiveListDetails {
    ReactiveList: new<T>() => ReactiveList<T>
}
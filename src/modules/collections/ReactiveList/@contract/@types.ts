import { ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";

export type ReactiveList<T> = ReactiveObject & {
    add(value: T): void;
    remove(value: T): void;

    //TODO: callbacks ???
};
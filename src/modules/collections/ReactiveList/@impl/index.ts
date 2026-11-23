import { Mutable } from "MWL@2026/modules/@types";
import { CallbackList } from "MWL@2026/modules/Callbacks";
import { trigger } from "MWL@2026/modules/Observable";
import { ReactiveObject, requestReaction } from "MWL@2026/modules/Reactive/Reaction";
import {ReactiveList} from "../@contract/@types";

//TODO: move
function asMutable<T>(target: T): Mutable<T> { return target; }

//TODO: events - how to store ?
//TODO: events - [X] before or [ ] after reaction ?
const ReactiveList
    = class <T> extends ReactiveObject implements ReactiveList<T> {

    readonly elements: ReadonlyArray<T> = new Array<T>();

    readonly insertionEvent = new CallbackList<[T]>();
    readonly   removalEvent = new CallbackList<[T]>();

    add(elem: T) {
        asMutable(this.elements).push(elem);

        trigger(this.insertionEvent, elem);
        requestReaction(this);
    }

    remove(elem: T) {
        const idx = this.elements.indexOf(elem);
        __ASSERT__(idx !== -1, "Elem not found");
        asMutable(this.elements).splice(idx, 1);

        trigger(this.removalEvent, elem);
        requestReaction(this);
    }
}

export {ReactiveList};
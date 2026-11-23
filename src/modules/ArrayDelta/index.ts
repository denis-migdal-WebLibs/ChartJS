import { NO_VALUE } from "MWL@2026/modules/@types";

export class ArrayDelta<T> {

    readonly added   = new Array<T>();
    readonly removed = new Array<T>();

    recordInsertion(...elements: T[]): void {
        // even if the element was marked for removal, we still record the addition
        // this enables to keep the elements order.
        this.added.push(...elements);
    }

    recordRemoval(element: T): void {

        const idx = this.removed.indexOf(element);
        if( idx !== -1) {
            this.removed.splice(idx, 1);
        }
        
        this.removed.push(element);
    }

    get isEmpty() {
        return this.added.length === 0 && this.removed.length === 0;
    }

    clear() {
        this.added  .length = 0;
        this.removed.length = 0;
    }
}

export function lazyRemove<T>(target: T[], element: T) {
    const idx = target.indexOf(element);
    __ASSERT__(idx !== -1, "Element not found");

    target[idx] = NO_VALUE;
}
export function stableCompact<T>(target: T[]) {

    const idx = target.indexOf(NO_VALUE);
    if( idx === -1) return;

    let offset = idx;
    for(let i = idx+1; i < target.length; ++i)
        if( target[i] !== NO_VALUE)
            target[offset++] = target[i];

    target.length = offset;
}
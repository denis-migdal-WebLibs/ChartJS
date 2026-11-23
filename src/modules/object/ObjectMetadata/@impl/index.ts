import type {ObjectMetadata} from "../@contract/@types";

const ObjectMetadata = class <T> implements ObjectMetadata<T> {

    private readonly KEY;

    constructor(name?: string) {
        this.KEY = Symbol(name);
    }

    set(target: object, value: T) {
        (target as any)[this.KEY] = value;
    }

    get(target: object): T {
        __ASSERT__( this.has(target),
                    `Metadata ${this.KEY.toString()} not found`);

        return (target as any)[this.KEY];
    }

    getOrNull(target: object): T|null {
        if( ! this.has(target) )
            return null;

        return this.get(target);
    }

    has(target: object) {
        return this.KEY in target;
    }

}

export {ObjectMetadata};
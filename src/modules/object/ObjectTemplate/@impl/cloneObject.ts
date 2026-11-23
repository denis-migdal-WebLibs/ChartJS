import { SHARED } from "./sharedObject";

const targetStack = new Array<any>();
const sourceStack = new Array<any>();

// this function isn't public (for now).
export function cloneObject<T extends Record<string, any>>(template: T): T {

    const result = {} as T;

    sourceStack.push(template);
    targetStack.push(result);

    while( sourceStack.length ) {

        const source = sourceStack.pop();
        const target = targetStack.pop();
        
        for(const key in source) {

            const value = source[key];
            if(    value === null
                || typeof value !== "object"
                || value[SHARED] === true) {
                target[key] = source[key];
                continue;
            }

            let targetValue = {};
            if( Array.isArray(value) )
                targetValue = new Array(value.length);

            sourceStack.push(value);
            targetStack.push(target[key] = targetValue);
        }
    }

    return result;
}
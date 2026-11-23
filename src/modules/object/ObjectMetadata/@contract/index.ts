import { ObjectMetadata } from "./@types";

export interface ObjectMetadataDetails {
    ObjectMetadata: new<T>(name?: string) => ObjectMetadata<T>
}
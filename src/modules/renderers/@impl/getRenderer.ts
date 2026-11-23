import { ObjectMetadata } from "Chart@2026/modules/object";
import { Renderer } from "../@contract/@types";
import { RendererProviderMetadata } from "./defineRenderer";

const RendererInstanceMetadata = new ObjectMetadata<Renderer>("renderer");

export function getRenderer(target: object): Renderer {
    
    let renderer = RendererInstanceMetadata.getOrNull(target);

    if( renderer === null) {
        const provider = RendererProviderMetadata.get(target.constructor);
        renderer = provider(target);
        RendererInstanceMetadata.set(target, renderer);
    }

    return renderer;
}

import "@config";

import "npm/canvas";

import {ChartImage} from "Chart@2026/ui/cli/ChartImage";
import init from "Chart@2026/examples/line";


Deno.test("IMG generation", async () => {

    const image = new ChartImage(200,200);

    init(image.subject);

    await Deno.writeFile("/tmp/img.png", await image.draw());
});
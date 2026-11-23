import {ChartWidget} from "Chart@2026/ui/web/widgets/Chart/";

import init from "Chart@2026/examples/line";

const widget = new ChartWidget();

init(widget.subject);

document.body.append(widget);
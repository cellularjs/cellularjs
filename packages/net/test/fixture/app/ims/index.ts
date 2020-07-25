import { Cell } from "../../../../src";
import { CustomContext } from "../../share/custom-context";
import { RenderHtml } from "./events/render-html.event";

@Cell({
  context: CustomContext,
  listen: { RenderHtml },
})
export class IMSCell { }
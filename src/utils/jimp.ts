import { createJimp } from "@jimp/core";
import png from "@jimp/js-png";
import * as resize from "@jimp/plugin-resize";

export const MyJimp = createJimp({
	plugins: [resize.methods],
	formats: [png],
});

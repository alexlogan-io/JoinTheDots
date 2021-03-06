﻿import * as d3 from "d3";

export function alexValToPixY(inputValue) {
    return ((inputValue / 0.27) - (30 / 0.27) - 1000) * -1;
}

export function alexPixToValY(inputValue) {
    return (((inputValue + 1000) * 0.27 + 30) - 600) * -1;
}

export function alexValToPixX(inputValue) {
    return (inputValue / 0.455) - (45 / 0.455) - 1000;
}

export function alexPixToValX(inputValue) {
    return (inputValue + 1000) * 0.455 + 45;
}

export const lineFunction = d3.line()
    .curve(d3.curveLinear)
    .x(function (d) { return d['x']; })
    .y(function (d) { return d['y']; });


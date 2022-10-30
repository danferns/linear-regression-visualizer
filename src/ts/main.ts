/* eslint-disable @typescript-eslint/no-explicit-any */

import { data } from "./getData";
import { GradientDescent } from "./gradientDescent";
import CostXML from "../data/costXML";

declare global {
    interface Window {
        line: any;
        cost: any;
        mb: any;
        mbUpdated: () => void;
    }
}

let line, cost, mb;

export async function init() {
    const gradientDescent = initGradientDescent();

    line = window.line;
    cost = window.cost;
    mb = window.mb;

    // set up cost graph
    const X = gradientDescent.X;
    const X2 = gradientDescent.X2;
    const Y = gradientDescent.Y;
    const Y2 = gradientDescent.Y2;
    const XY = gradientDescent.XY;
    const n = gradientDescent.n;
    cost.setXML(CostXML);
    cost.evalCommand(
        `c(m, b) = (${Y2} - 2 * m * ${XY} + 2 * m * b * ${X} + m^2 * ${X2} + b^2 * ${n} - 2 * b * ${Y}) / ${n}`
    );

    // set up mb plane, and link it to line
    const m = 1,
        b = 1;
    mb.evalCommand(`m = ${m}`);
    mb.evalCommand(`b = ${b}`);
    mb.evalCommand("M = (m, 0)");
    mb.evalCommand("B = (0, b)");
    mb.evalCommand("Line = (m, b)");
    mb.registerObjectUpdateListener("Line", "mbUpdated");

    // set up line graph

    window.mbUpdated();
    line.setLineThickness("f", 9);
    for (let i = 0; i < 20; i++) {
        // draw data point
        line.evalCommand(`P${i} = (${data[i][0]}, ${data[i][1]})`);
        line.setLabelVisible(`P${i}`, false);
        line.setFixed("P" + i, true, true);
        line.setPointSize("P" + i, 4);
        // draw line from point to line
        line.evalCommand(
            `L${i} = Vector((${data[i][0]}, f(${data[i][0]})), P${i})`
        );
        line.setLineThickness(`L${i}`, 1);
        line.setLabelVisible(`L${i}`, false);
    }

    const { m: newM, b: newB } = await gradientDescent.train(
        m,
        b,
        500,
        onDescendStep
    );
    console.log(`m: ${newM}, b: ${newB}`);
}

window.mbUpdated = function () {
    const m = mb.getXcoord("M");
    const b = mb.getYcoord("B");
    line.evalCommand(`f(x) = ${m} * x + ${b}`);
    cost.evalCommand(`Cost = (${m}, ${b}, c(${m}, ${b}))`);
};

function initGradientDescent() {
    const learningRate = 0.01;
    const gradientDescent = new GradientDescent(learningRate);
    for (let i = 0; i < data.length; i++) {
        gradientDescent.addDataPoint(data[i][0], data[i][1]);
    }
    return gradientDescent;
}

async function onDescendStep(m: number, b: number) {
    mb.evalCommand(`m = ${m}`);
    mb.evalCommand(`b = ${b}`);
    await wait(1);
}

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

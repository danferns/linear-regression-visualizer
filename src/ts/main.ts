/* eslint-disable @typescript-eslint/no-explicit-any */

import { data } from "./getData";
import { GradientDescent } from "./gradientDescent";
import CostXML from "../data/costXML";
import { COLORS } from "./colorScheme";
import { writable } from "svelte/store";

declare global {
    interface Window {
        line: any;
        cost: any;
        mb: any;
        mbUpdated: () => void;
    }
}

let line, cost, mb;
let gradientDescent, m, b;
let delayValue = 50;

export const learningRate = writable(0.01);
export const delay = writable(50);

learningRate.subscribe((val) => {
    if (gradientDescent) gradientDescent.learningRate = val;
})

delay.subscribe((val) => {
    delayValue = val
})

export async function init() {
    gradientDescent = initGradientDescent();

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
    cost.setColor("c", ...COLORS.cost);

    // set up mb plane, and link it to line
    m = 1, b = 1;
    mb.evalCommand(`m = ${m}`);
    mb.evalCommand(`b = ${b}`);
    mb.evalCommand("M = (m, 0)");
    mb.evalCommand("B = (0, b)");
    mb.evalCommand("Line = (m, b)");
    mb.registerObjectUpdateListener("Line", "mbUpdated");
    mb.setColor("M", ...COLORS.slope);
    mb.setColor("B", ...COLORS.intercept);
    mb.setColor("Line", ...COLORS.line);

    // set up line graph

    window.mbUpdated();
    line.setLineThickness("f", 9);
    line.setColor("f", ...COLORS.line);
    for (let i = 0; i < 20; i++) {
        // draw data point
        line.evalCommand(`P${i} = (${data[i][0]}, ${data[i][1]})`);
        line.setLabelVisible(`P${i}`, false);
        line.setFixed("P" + i, true, true);
        line.setPointStyle("P" + i, 1);
        line.setPointSize("P" + i, 3);
        line.setColor("P" + i, ...COLORS.data);
        // draw line from point to line
        line.evalCommand(
            `L${i} = Vector((${data[i][0]}, f(${data[i][0]})), P${i})`
        );
        line.setLineThickness(`L${i}`, 1);
        line.setLabelVisible(`L${i}`, false);
        line.setColor(`L${i}`, ...COLORS.cost);
    }
    
    cost.setColor("Cost", ...COLORS.line);
    // startTraining();
}

export let trainingDisabled = false;
export async function startTraining() {
    trainingDisabled = false;
    const { m: newM, b: newB } = await gradientDescent.train(
        m,
        b,
        500,
        onDescendStep
    );
    console.log(`m: ${newM}, b: ${newB}`);
}

export function stopTraining() {
    trainingDisabled = true;
}

window.mbUpdated = function () {
    m = mb.getXcoord("M");
    b = mb.getYcoord("B");
    setRepainting(false);
    line.evalCommand(`f(x) = ${m} * x + ${b}`);
    cost.evalCommand(`Cost = (${m}, ${b}, c(${m}, ${b}))`);
    setRepainting(true);
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
    setRepainting(false);
    mb.evalCommand(`m = ${m}`);
    mb.evalCommand(`b = ${b}`);
    setRepainting(true);
    await wait(delayValue);
    return trainingDisabled
}

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setRepainting(state: boolean) {
    line.setRepaintingActive(state);
    cost.setRepaintingActive(state);
    mb.setRepaintingActive(state);
}
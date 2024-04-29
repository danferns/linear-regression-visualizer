export class GradientDescent {
    learningRate = 0.01;
    X = 0;
    X2 = 0;
    Y = 0;
    Y2 = 0;
    XY = 0;
    n = 0;

    constructor(learningRate: number) {
        this.learningRate = learningRate;
    }

    addDataPoint(x: number, y: number) {
        this.X += x;
        this.X2 += x * x;
        this.Y += y;
        this.Y2 += y * y;
        this.XY += x * y;
        this.n++;
    }

    getGradient(m: number, b: number) {
        const dm = (-2 * this.XY + 2 * m * this.X2 + 2 * b * this.X) / this.n;
        const db = (-2 * this.Y + 2 * m * this.X + 2 * b * this.n) / this.n;

        return { dm, db };
    }

    step(m: number, b: number) {
        const { dm, db } = this.getGradient(m, b);
        return { m: m - dm * this.learningRate, b: b - db * this.learningRate };
    }

    async train(
        m: number,
        b: number,
        iterations: number,
        onStep: (m: number, b: number) => Promise<boolean> = async () => {
            return false;
        }
    ) {
        for (let i = 0; i < iterations; i++) {
            const { m: newM, b: newB } = this.step(m, b);
            m = newM;
            b = newB;
            const trainingDisabled = await onStep(m, b)
            if (trainingDisabled) {
                break
            }
        }
        return { m, b };
    }
}

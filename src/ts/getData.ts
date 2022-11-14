export const data = [];

// for now, let's just generate some dummy data

const m = Math.random() - 2 * Math.random(),
    b = (Math.random() * 0.5 + 0.5) * 4;

for (let i = 0; i < 20; i++) {
    const x = i * 0.5;
    const y = m * x + b + (Math.random() - 0.5) * 0.5;
    data.push([x, y]);
}

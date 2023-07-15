# Linear Regression Visualizer

This project demonstrates how the Gradient Descent algorithm can find the line of best fit for a given set of points.

![image](https://github.com/danferns/linear-regression-visualizer/assets/57069381/37fcfb9a-7d56-4998-bd87-7ee0495a7986)

Each time you open the project, some points are randomly generated which vaguely resemble a line.
We also have an actual line (in green) defined by slope `M` and intercept `B`.

```
y = Mx + B
```

The goal of the algorithm is to get the green line to match those points as closely as possible.

## Slope-Intercept Plane

On the top left view, you can see a plane with the `M` and `B` axes. Since a line can be defined solely by these two values,
every point on this plane corresponds to a unique line. You can click and drag the `M`, `B`, and `Line` points in this view
to see how the line changes as you change these values.

## Error Function

// todo

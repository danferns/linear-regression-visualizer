# Linear Regression Visualizer

This project demonstrates how the Gradient Descent algorithm can find the line of best fit for a given set of points.

![image](https://github.com/danferns/linear-regression-visualizer/assets/57069381/37fcfb9a-7d56-4998-bd87-7ee0495a7986)

Each time you open the page, some points are randomly generated (marked by `×`) which vaguely resemble a line.
We also have an actual line (in green) defined by slope `M` and intercept `B`:

```math
y = Mx + B
```

The goal of the algorithm is to get the line to match the points as closely as possible.

## Slope-Intercept Plane

On the top left view, you can see a plane with the `M` and `B` axes. Since a line can be defined solely by these two values,
every point on this plane corresponds to a unique line. You can click and drag the `M`, `B`, and `Line` points in this view
to see how the line changes as you change these values.

## Error Function

Linear Regression uses a cost/error function to find out how far the line is from the points. The function takes the
vertical distances from the line to each of the points (indicated by the brown arrows), squares them individually, and then
sums up the squares:

```math
Error(M, B) = \sum_{i} (y(x_i) - y_i) ^ 2
```

Intuitively, we know that if we move the line, we also change the error value. The 3D plot on the bottom left shows us how 
the cost varies for the lines represented by the points on the Slope-Intercept plane.

## Gradient Descent

We can see that the cost function has a bowl-like shape to it, and the lowest point of this bowl is where the error value
is minimum. The `M` and `B` values at this point define the line of best fit (the line with the least error).

The Gradient Descent algorithm starts out with any values for `M` and `B`, and then adjusts them in the direction in which the
error will be reduced the most. It does this adjustment many times, descending down the error function until it reaches close
enough to the local minima.

It knows the direction to move towards by finding the
[Gradient](https://www.khanacademy.org/math/multivariable-calculus/multivariable-derivatives/gradient-and-directional-derivatives/v/gradient)
of the error function, and moving in the direction that is opposite to the gradient vector at the current point.

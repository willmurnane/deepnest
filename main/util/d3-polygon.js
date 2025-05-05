// https://d3js.org/d3-polygon/ Version 1.0.2. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : factory((global.d3 = global.d3 || {}));
})(this, function (exports) {
  "use strict";

  // Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
  // the 3D cross product in a quadrant I Cartesian coordinate system (+x is
  // right, +y is up). Returns a positive value if ABC is counter-clockwise,
  // negative if clockwise, and zero if the points are collinear.
  var cross = function (a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  };

  function lexicographicOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }

  // Computes the upper convex hull per the monotone chain algorithm.
  // Assumes points.length >= 3, is sorted by x, unique in y.
  // Returns an array of indices into points in left-to-right order.
  function computeUpperHullIndexes(points) {
    var n = points.length,
      indexes = [0, 1],
      size = 2;

    for (var i = 2; i < n; ++i) {
      while (
        size > 1 &&
        cross(
          points[indexes[size - 2]],
          points[indexes[size - 1]],
          points[i]
        ) <= 0
      )
        --size;
      indexes[size++] = i;
    }

    return indexes.slice(0, size); // remove popped points
  }

  var hull = function (points) {
    if ((n = points.length) < 3) return null;

    var i,
      n,
      sortedPoints = new Array(n),
      flippedPoints = new Array(n);

    for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];
    sortedPoints.sort(lexicographicOrder);
    for (i = 0; i < n; ++i)
      flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

    var upperIndexes = computeUpperHullIndexes(sortedPoints),
      lowerIndexes = computeUpperHullIndexes(flippedPoints);

    // Construct the hull polygon, removing possible duplicate endpoints.
    var skipLeft = lowerIndexes[0] === upperIndexes[0],
      skipRight =
        lowerIndexes[lowerIndexes.length - 1] ===
        upperIndexes[upperIndexes.length - 1],
      hull = [];

    // Add upper hull in right-to-l order.
    // Then add lower hull in left-to-right order.
    for (i = upperIndexes.length - 1; i >= 0; --i)
      hull.push(points[sortedPoints[upperIndexes[i]][2]]);
    for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i)
      hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

    return hull;
  };

  exports.polygonHull = hull;

  Object.defineProperty(exports, "__esModule", { value: true });
});

"use strict";

function dijkstra(graph, start) {
  if (graph === null || typeof graph !== "object" || Array.isArray(graph)) {
    throw new TypeError("Graph must be an object adjacency list.");
  }

  const nodes = new Set();

  for (const [node, edges] of Object.entries(graph)) {
    nodes.add(node);

    if (edges === null || typeof edges !== "object" || Array.isArray(edges)) {
      throw new TypeError(`Edges for node "${node}" must be an object.`);
    }

    for (const [neighbor, weight] of Object.entries(edges)) {
      nodes.add(neighbor);

      if (!Number.isFinite(weight)) {
        throw new TypeError(`Weight for edge "${node}" -> "${neighbor}" must be a number.`);
      }
      if (weight < 0) {
        throw new RangeError(`Weight for edge "${node}" -> "${neighbor}" must be non-negative.`);
      }
    }
  }

  if (!nodes.has(start)) {
    throw new Error(`Start node "${start}" is not present in the graph.`);
  }

  const distances = {};
  const previous = {};

  for (const node of nodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  while (nodes.size > 0) {
    let current = null;
    let currentDistance = Infinity;

    for (const node of nodes) {
      const distance = distances[node];
      if (distance < currentDistance) {
        currentDistance = distance;
        current = node;
      }
    }

    if (current === null || currentDistance === Infinity) {
      break;
    }

    nodes.delete(current);

    const edges = graph[current] || {};
    for (const [neighbor, weight] of Object.entries(edges)) {
      if (!nodes.has(neighbor)) {
        continue;
      }

      const candidate = currentDistance + weight;
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;
      }
    }
  }

  return { distances, previous };
}

function shortestPath(previous, start, target) {
  const path = [];
  let current = target;

  while (current !== null) {
    path.unshift(current);
    if (current === start) {
      return path;
    }
    current = previous[current];
  }

  return [];
}

if (require.main === module) {
  const graph = {
    A: { B: 4, C: 1 },
    B: { E: 4 },
    C: { B: 2, D: 4 },
    D: { E: 4 },
    E: {},
  };

  const { distances, previous } = dijkstra(graph, "A");
  console.log("Distances:", distances);
  console.log("Shortest path A -> E:", shortestPath(previous, "A", "E"));
}

module.exports = { dijkstra, shortestPath };

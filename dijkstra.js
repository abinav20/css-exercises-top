"use strict";

class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value) {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length === 0) {
      return null;
    }

    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.items[parent].priority <= this.items[current].priority) {
        break;
      }
      [this.items[parent], this.items[current]] = [this.items[current], this.items[parent]];
      current = parent;
    }
  }

  bubbleDown(index) {
    let current = index;
    const length = this.items.length;
    while (true) {
      const left = current * 2 + 1;
      const right = left + 1;
      let smallest = current;

      if (left < length && this.items[left].priority < this.items[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.items[right].priority < this.items[smallest].priority) {
        smallest = right;
      }

      if (smallest === current) {
        break;
      }

      [this.items[smallest], this.items[current]] = [this.items[current], this.items[smallest]];
      current = smallest;
    }
  }
}

/**
 * Runs Dijkstra's algorithm on a weighted graph with non-negative edge weights.
 * @param {Record<string, Record<string, number>>} graph
 * @param {string} start
 * @returns {{ distances: Record<string, number>, previous: Record<string, string | null> }}
 */
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

  const heap = new MinHeap();
  const visited = new Set();
  heap.push({ node: start, priority: 0 });

  while (heap.size > 0) {
    const currentEntry = heap.pop();
    if (!currentEntry) {
      break;
    }

    const { node: current, priority: currentDistance } = currentEntry;
    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    const edges = graph[current] || {};
    for (const [neighbor, weight] of Object.entries(edges)) {
      const candidate = currentDistance + weight;
      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;
        heap.push({ node: neighbor, priority: candidate });
      }
    }
  }

  return { distances, previous };
}

/**
 * Reconstructs the shortest path from the previous-node map.
 * @param {Record<string, string | null>} previous
 * @param {string} start
 * @param {string} target
 * @returns {string[]}
 */
function shortestPath(previous, start, target) {
  const path = [];
  let current = target;

  while (current !== null) {
    path.push(current);
    if (current === start) {
      break;
    }
    current = previous[current];
  }

  if (path[path.length - 1] !== start) {
    return [];
  }

  return path.reverse();
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

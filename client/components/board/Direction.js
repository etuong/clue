const directions = new Map();

directions.set([0, 0], [[0, 1], [1, 0]]);
directions.set([0, 1], [[0, 0], [1, 1], [0, 2]]);
directions.set([0, 2], [[0, 1], [1, 2], [0, 3]]);
// Continue

export default directions;
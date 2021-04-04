//function to validate if the coordinate is reachable
let height;
let width;
let visited;

function valid(x, y) {
	if(x < 0 || y < 0 || x >= height || y >= width || visited[x][y]) {
		return false;
	}
	return true;
}


// returns a path if any
function searchBFS(graph, x_start, y_start, x_end, y_end, doc, color) {
	height = graph.length;
	width = graph[0].length;
	visited = [];
	let path = [];
	for(let i = 0; i < height; i++) {
		let temp1 = [];
		let temp2 = [];
		for(let j = 0; j < width; j++) {
			temp1.push(false);
			temp2.push(`${i}x${j}y`);
		}
		visited.push(temp1);
		path.push(temp2);
	}

	let queue = [];
	queue.push([x_start, y_start]);
	visited[x_start][y_start] = true;
	let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

	let repeat = setInterval(function() {
		if(queue.length === 0) {
			clearInterval(repeat);
			return undefined;
		}
		
		let arr = queue.shift();
		let x = arr[0];
		let y = arr[1];

		if(x === x_end && y === y_end) {
			return path;
		}
		doc.getElementById(`${x}x${y}y`).backgroundColor = color;

		for(const arr of directions) {
			let x_new = x + arr[0];
			let y_new = y + arr[1];

			if(valid(x_new, y_new) && graph[x_new][y_new] != 0) {
				visited[x_new][y_new] = true;
				path[x_new][y_new] = `${x}x${y}y`;
				queue.push([x_new, y_new]);
			}
		}
	}, 10);

}

export default searchBFS;
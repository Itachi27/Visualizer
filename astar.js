export default function searchAstar(graph, x_start, y_start, x_end, y_end, doc) {
	let height = graph.length;
	let width = graph[0].length;
	let visited = [];
	let path = [];
  let delayTime = 10;
  const valid = (x, y) => {
    if(x < 0 || y < 0 || x >= height || y >= width || visited[x][y] || graph[x][y] == 0) {
      return false;
    }
    return true;
  };
  
  const heuristic = (x, y) => {
    return (Math.abs(x - x_end) + Math.abs(y - y_end)) + Math.max(Math.abs(x - x_end), Math.abs(y - y_end)) + Math.sqrt(Math.pow(x - x_end, 2) + Math.pow(y - y_end, 2));
  }
  
  let cost = [];
  
	for(let i = 0; i < height; i++) {
		let temp1 = [];
		let temp2 = [];
    let temp3 = [];
		for(let j = 0; j < width; j++) {
			temp1.push(false);
			temp2.push("");
      temp3.push(0);
		}
		visited.push(temp1);
		path.push(temp2);
    cost.push(temp3);
	}
  
 
  //cost[x_new][y_new] = 1 + cost[x][y];

	let queue = [];
	queue.push([x_start, y_start]);
	visited[x_start][y_start] = true;
  path[x_start][y_start] = `${x_start}x${y_start}y`;
	let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  
    
  while(true) {
		if(queue.length === 0) {
			path = undefined;
      break;
		}
		
		let arr = queue.shift();
		let x = arr[0];
		let y = arr[1];
  
		if(x === x_end && y === y_end) {
      break;
		}
		if(x != x_start || y != y_start) {
      setTimeout( () => {
        document.getElementById(`${x}x${y}y`).className = "block searchBlock";
      }, delayTime);
      
      delayTime += 5;
    }
    
		for(const arr of directions) {
			let x_new = x + arr[0];
			let y_new = y + arr[1];
      
			if(valid(x_new, y_new)) {
				visited[x_new][y_new] = true;
				path[x_new][y_new] = `${x}x${y}y`;
        cost[x_new][y_new] = 1 + cost[x][y];
        
        let f = cost[x_new][y_new] + heuristic(x_new, y_new);
				queue.push([x_new, y_new]);
			}
		}
	}
  return [path, delayTime + 500];
}
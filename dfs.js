// returns a path if any
export default function searchDFS(
  graph,
  x_start,
  y_start,
  x_end,
  y_end,
  doc,
  color
) {
  let height = graph.length;
  let width = graph[0].length;
  let visited = [];
  let path = [];
  const valid = (x, y) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= height ||
      y >= width ||
      visited[x][y] ||
      graph[x][y] == 0
    ) {
      return false;
    }
    return true;
  };

  for (let i = 0; i < height; i++) {
    let temp1 = [];
    let temp2 = [];
    for (let j = 0; j < width; j++) {
      temp1.push(false);
      temp2.push("");
    }
    visited.push(temp1);
    path.push(temp2);
  }

  path[x_start][y_start] = `${x_start}x${y_start}y`;
  let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  let delayTime = 10;

  function dfs(x, y) {
    if (path[x_end][y_end] != "") {
      return;
    }
    visited[x][y] = true;

    if (x != x_start || y != y_start) {
      setTimeout(() => {
        document.getElementById(`${x}x${y}y`).className = "block searchBlock";
      }, delayTime);

      delayTime += 5;
    }

    for (const arr of directions) {
      let x_new = x + arr[0];
      let y_new = y + arr[1];
      if (valid(x_new, y_new) && path[x_end][y_end] === "") {
        path[x_new][y_new] = `${x}x${y}y`;
        dfs(x_new, y_new);
      }
    }
  }
  
  dfs(x_start, y_start);
  
  if(path[x_end][y_end] === "") {
    return undefined;
  }
  else {
    return [path, delayTime + 300];
  }
  
}

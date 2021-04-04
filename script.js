import searchBFS from "./bfs.js";
import searchDFS from "./dfs.js";
import searchAstar from "./astar.js";

//some dom elements
const body = document.getElementById("body");
const message = document.getElementById("message");
const grid = document.getElementById("grid");
const dropdownButton = document.getElementById("dropdownMenuButton");
const modeName = document.getElementById("modeName");
//

message.style.textAlign = "center";

//colors
const bodyColor = "black";
const gridColor = "white";
const searchColor = "Turquoise";
const pathColor = "indigo";
const startNodeColor = "darkolivegreen";
const endNodeColor = "red";
const wallColor = "black";
//

//css classNames
const buttonsClassNames = "btn btn-sm btn-secondary mx-1";
const blocksClassNames = "block";
const dropDownClassNames = "btn btn-secondary dropdown-toggle ml-4";
//

//variables
let height = 26;
let width = 50;
let graph = [];
let x_start = -1;
let x_end = -1;
let y_start = -1;
let y_end = -1;
let item = "wall";
let path;
let delayTime;
let mode = "";
let searching = false;
let startMode = false;
let name = ""; // let this hold the aglo name
//

init();
//to add action listeners and to place the dom elements
function init() {
  body.style.backgroundColor = bodyColor;
  let s = "";
  s += "Click On Any Block To Place A Wall(Optional)";
  s +=
    "<br>Click On The StartNode Button And Click On Any Block To Place The StartNode";
  s +=
    "<br>Click On The EndNode Button And Click On Any Block To Place The EndNode";
  s +=
    "<br>Finally Select An Algorithm From The DropDown And Hit StartSearch!";
  message.innerHTML = s;
  message.style.backgroundColor = "rosybrown";

  //adding action listeners to buttons
  let buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      handleButtons(this.id);
      switch (buttons[i].id) {
        case "startNode":
        case "endNode":
          buttons[i].className = buttonsClassNames;
          break;
          
        case "dropdownMenuButton":
          buttons[i].className = dropDownClassNames;
          break;
      }
    });
  }

  let str = "";
  for (let i = 0; i < height; i++) {
    let arr = [];
    for (let j = 0; j < width; j++) {
      arr.push(1);
      str += `<div id="${i}x${j}y" class="block"></div>`;
    }
    graph.push(arr);
  }

  grid.innerHTML = str;
  grid.style.BackgroundColor = gridColor;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      document
        .getElementById(`${i}x${j}y`)
        .addEventListener("click", function() {
          // let arr = getCoordinates(`${i}x${j}y`);
          // let x = arr[0];
          // let y = arr[1];
          if (mode === "") {
            let x = i;
            let y = j;

            if (item === "wall") {
              if (x === x_start && y === y_start) {
                x_start = -1;
                y_start = -1;
              } else if (x === x_end && y === y_end) {
                x_end = -1;
                y_end = -1;
              }
              graph[x][y] = graph[x][y] === 0 ? 1 : 0;
              if(graph[x][y] === 0) {
                this.className = "block wall blink";
              }
              else {
                this.className = "block blink";
              }
              
            } else if (item === "startNode") {
              if (x_start != -1 && y_start != -1) {
                document.getElementById(
                  `${x_start}x${y_start}y`
                ).className = "block";
              }
              x_start = x;
              y_start = y;
              this.className = "block startNode blink";
              graph[x][y] = 1;
              item = "wall";
            } else if (item === "endNode") {
              if (x_end != -1 && y_end != -1) {
                document.getElementById(
                  `${x_end}x${y_end}y`
                ).className = "block";
              }
              x_end = x;
              y_end = y;
              this.className = "block endNode blink";
              graph[x][y] = 1;
              item = "wall";
            }
          } else {
            startMode = true;
            message.innerHTML =
              "TIP: Hover Over To Perform Action<br>TIP: DoubleClick LeftMouseButton To Quit " +
              mode.toUpperCase() +
              " Mode";
          }
        });
    }
  }

  //add hover
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      document
        .getElementById(`${i}x${j}y`)
        .addEventListener("mouseover", function() {
          if (startMode) {
            let x = i;
            let y = j;
            if (x == x_start && y == y_start) {
              x_start = -1;
              y_start = -1;
            } else if (x === x_end && y === y_end) {
              x_end = -1;
              y_end = -1;
            }

            if (mode === "wall") {
              graph[x][y] = 0;
              this.className = "block wall";
            } else if (mode === "erase") {
              graph[x][y] = 1;
              this.className = "block";
            }
          }
        });
    }
  }

  grid.addEventListener("dblclick", function() {
    mode = "";
    modeName.innerHTML = "";
    message.innerHTML = "";
    startMode = false;
  });
}

//handle all the buttons
function handleButtons(value) {
  if(!searching) {
    switch (value) {
      case "startNode":
        item = value;
        break;

      case "endNode":
        item = value;
        break;

      case "erase":
      case "wall":
        let a = "Placing Walls";
        if (mode === "erase") {
          a = "Erasing";
        }
        startMode = false;
        mode = value;
        modeName.innerHTML = mode.toUpperCase() + " MODE";
        message.innerHTML = "TIP: Click To Start " + a;
        break;

      case "clearAll":
        if (searching) {
          message.innerHTML = "<br>ERROR: Cannot Clear While Searching";
          message.style.backgroundColor = "crimson";
        } else {
          reinit();
        }
        break;

      case "startSearch":
        if (checkErrors() === "noError") {
          startSearch();
        } else {
          searching = false;
        }
        break;

      case "createPattern":
        createPattern();
        break;

      case "help":
        help();
        break;

      case "bfs":
      case "dfs":
      case "dijkstra":
      case "astart":
        name = value;
        dropdownButton.innerHTML = value.toUpperCase();
        dropdownButton.classNames = dropDownClassNames;
        dropdownButton.style.backgroundColor = "lightgreen";
        break;
    }
  }
  else {
    message.innerHTML = "<br>ERROR: Cannot Perform Action While Searching";
    message.style.backgroundColor = "crimson";
  }
}

//function to get the coordinates
function getCoordinates(str) {
  let x = "";
  let i = 0;

  while (str[i] != "x") {
    x += str[i];
    i++;
  }

  i++;
  let y = "";
  while (str[i] != "y") {
    y += str[i];
    i++;
  }

  return [parseInt(x), parseInt(y)];
}

function startSearch() {
  searching = true;
  message.innerHTML = "";
  let arr;
  if (name === "bfs") {
    arr = searchBFS(
      graph,
      x_start,
      y_start,
      x_end,
      y_end,
      document,
      searchColor
    );
  } else if (name === "dfs") {
    arr = searchDFS(
      graph,
      x_start,
      y_start,
      x_end,
      y_end,
      document,
      searchColor
    );
  }
  else if (name === "astar") {
    arr = searchAstar(
      graph,
      x_start,
      y_start,
      x_end,
      y_end,
      document,
      searchColor
    );
  }


  if (arr[0]) {
    path = arr[0];
    delayTime = arr[1];
    setTimeout(drawPath, delayTime + 200);
    setTimeout(() => {
      message.innerHTML = "PATH FOUND";
      message.style.backgroundColor = "lightgreen";
      searching = false;
    }, delayTime + 700);
  } else {
    
    searching = false;
    setTimeout(() => {
      message.innerHTML = "PATH NOT FOUND";
      message.style.backgroundColor = "yellow";
    }, delayTime + 20);
  }
  // setTimeout(() => {
  //   message.style.backgroundColor = "skyblue";
  // }, delayTime + 700);
}

function drawPath() {
  delayTime = 0;
  let arr = getCoordinates(path[x_end][y_end]);
  let x = arr[0];
  let y = arr[1];

  while (x != x_start || y != y_start) {
    let element = document.getElementById(`${x}x${y}y`);
    if (element) {
      setTimeout(() => {
        element.className = "block pathBlock";
      }, delayTime);

      delayTime += 25;
      arr = getCoordinates(path[x][y]);
      x = arr[0];
      y = arr[1];
    } else {
      console.log("something went wrong");
      break;
    }
  }
  searching = false;
  message.className = "";
}

function reinit() {
  graph = [];
  x_start = -1;
  x_end = -1;
  y_start = -1;
  y_end = -1;
  item = "wall";
  path = undefined;
  delayTime = 0;
  message.innerHTML = "";
  searching = false;
  mode = "";
  startMode = false;
  init();
}

function checkErrors() {
  let str = "";

  if (x_start === -1) {
    str += "ERROR: Please Place The Start Node";
    document.getElementById("startNode").className =
      buttonsClassNames + " attention";
  }

  if (x_end === -1) {
    str += "<br>ERROR: Please Place The End Node";
    document.getElementById("endNode").className =
      buttonsClassNames + " attention";
  }

  if (name === "") {
    str += "<br>ERROR: Please Select An Algorithm";
    document.getElementById("dropdownMenuButton").className =
      buttonsClassNames + " attention";
  }
  
  message.innerHTML = str;

  if (str === "") {
    return "noError";
  } else {
    message.style.backgroundColor = "crimson";
    return "error";
  }
  
}

function help() {
  let s = "";
  s += "Click On Any Block To Place A Wall(Optional)";
  s +=
    "<br>lick On The StartNode Button And Click On Any Block To Place The StartNode";
  s +=
    "<br>Click On The EndNode Button And Click On Any Block To Place The EndNode";
  s +=
    "<br>Finally Select An Algorithm From The DropDown And Hit StartSearch! :) ";
  s +=
    "<br>EXTRA: Click On CreatePattern Button To Randomly Place Walls, You Can Click It Anynumber Of Times";
  s += "<br>EXTRA: Click On ClearAll Button To Clear The Grid";
  s +=
    "<br>EXTRA: Click On Erase Button To Enter EraseMode, Click On The Block To Start Erasing, Just Hover The Required Block To Erase It";
  s += "<br>EXTRA: Double Click Left Mouse To Exit EraseMode";
  s += "<br>EXTRA: Follow Same for Wall";
  s += "<br>Have Fun :)";

  message.innerHTML = s;
  message.style.backgroundColor = "rosybrown";
  message.className = "attention";
  setTimeout(() => {
    message.className = "";
  }, 1000);
}

function createPattern() {
  for (let i = 0; i < 50; i++) {
    let x = Math.floor(Math.random() * height);
    let y = Math.floor(Math.random() * width);
  //adding if loop to avoid walls forming at places where start n end node are present 
    if((x===x_start && y==y_start)||(x===x_end && y==y_end))
      {
        continue;
      }
    document.getElementById(`${x}x${y}y`).click();
  }
}

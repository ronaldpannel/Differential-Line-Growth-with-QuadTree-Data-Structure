let nodes = [];
let num = 10;
let r = 10;
let insertDistance = 5;
let separationDistance = insertDistance * 2;
let margin = 30;
let maxPoints = 3000;

let quadtree;
let boundary;
let capacity = 10;

function setup() {
  createCanvas(400, 400);

  boundary = new Rect(width / 2, height / 2, width / 2, height / 2);
  quadtree = new QuadTree(boundary, capacity);

  for (let i = 0; i < num; i++) {
    let angle = (TWO_PI / num) * i;
    let x = width / 2 + r * cos(angle);
    let y = height / 2 + r * sin(angle);
    nodes[i] = new Node(x, y);
  }
}

function draw() {
  background(220);
  // console.log(frameRate())

  quadtree.clearQuadtree();
  for (let i = 0; i < nodes.length; i++) {
    let p = new Point(nodes[i].position.x, nodes[i].position.y, nodes[i]);
    quadtree.insert(p);
  }

  // print(frameRate());
  for (let i = 0; i < nodes.length; i++) {
    let n1 = nodes[i].position;
    let n2 = nodes[(i + 1) % nodes.length].position;
    line(n1.x, n1.y, n2.x, n2.y);
  }

  for (let i = 0; i < nodes.length; i++) {
    let range = new Circle(
      nodes[i].position.x,
      nodes[i].position.y,
      separationDistance
    );
    let neighbors = [];
    quadtree.query(range, neighbors);

    nodes[i].update(nodes, neighbors);
    // nodes[i].display();
  }

  if (nodes.length < maxPoints) {
    insert();
  } else {
    noLoop();
    print("Max Points Reached");
  }
}

function insert() {
  for (let i = 0; i < nodes.length; i++) {
    let n1 = nodes[i].position;
    let n2 = nodes[(i + 1) % nodes.length].position;
    let diff = p5.Vector.sub(n2, n1);

    if (diff.mag() > insertDistance) {
      diff.mult(0.5);
      let insertIndex = (i + 1) % nodes.length;
      nodes.splice(insertIndex, 0, new Node(n1.x + diff.x, n1.y + diff.y));
    }
  }
}

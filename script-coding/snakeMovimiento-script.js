//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/

// Importamos las librerias
let { append, cons, first, isEmpty, isList, length, rest, map, forEach }  = functionalLight;

// Actualiza los atributos del objeto y retorna una copia profunda
function update(data, attribute) {
  return Object.assign({}, data, attribute);
}

//////////////////////// Mundo inicial
let Mundo = {}
////////////////////////
/**
 * Actualiza la serpiente. Creando una nuevo cabeza y removiendo la cola
 */
function moveSnake(snake, dir) {
  const head = first(snake);
  return cons({x: head.x + dir.x, y: head.y + dir.y}, snake.slice(0, length(snake) - 1));
}

const dx = 20;
const dy = dx;

const mapa = 20;

const x = dx * mapa;
const y = dy * mapa;

/**
 * Retorna un numero aleatorio multiplo de dx que esta dentro el rango del ancho y el alto del canvas
 */
 function food2(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function drawFood(food){
   fill(255,0,0);
  rect(food.x,food.y,dx,dy);
}
function updateFood(){
  return update(Mundo, {snake: moveSnake(Mundo.snake, Mundo.dir), food:{x:food2(1,mapa-1)*dx,y:food2(1,mapa-1)*dx},score: Mundo.score + 10});
}


function drawScore(score){
  fill(255,255,255);
  textSize(24);
  text("Score: " + score,dx,x-2*dx);
}



function concat(list1, list2){
  if (isEmpty(list1)) return list2;
  else return cons(first(list1), concat(rest(list1),list2));
}
function mapas(numero){
  if (numero == 0) return [0];
  else return concat(mapas(numero - 1), [numero]);
}
function drawWall(){
  fill(51,119,255);
  mapas(mapa).forEach(item => {
    rect(item*dx,0,dx,dy);
    rect(item*dx,x-dx,dx,dy);
    rect(0,item*dx,dx,dy);
    rect(x-dx,item*dx,dx,dy);
  })
}
function gameOver(){
  fill(255,255,255);
  textSize(44);
  text("Game Over",100,100);
}




/**
 * Esto se llama antes de iniciar el juego
 */
function setup() {
  Mundo = {snake: [{ x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], dir: {x: 1, y: 0}, food: {x:food2(1,mapa-1)*dx,y:food2(1,mapa-1)*dx}, score:0, speed:10, game:0 };
  frameRate(Mundo.speed);
  createCanvas(x, y);
  background(0, 0, 0);
}
let gamer = 0;
// Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
function drawGame(Mundo){
  const body = rest(Mundo.snake);
  const head = first(Mundo.snake);
 
  body.forEach(item => {
    if (head.x == item.x && head.y == item.y){
      gamer = 1;
      gameOver();
    } else if (head.x == 0 || head.y == 0 || head.x == (x-dx)/dx || head.y == (x-dx)/dx){
      gamer = 1;
      gameOver();
    } else if (gamer == 1){
      gameOver();
    } else {
      background(0, 0, 0);
      drawWall();
      drawScore(Mundo.score);
      drawFood(Mundo.food);
      fill(97, 255, 51);
      forEach(Mundo.snake, s => {
        rect(s.x * dx, s.y * dy, dx, dy);
      });  }
});
}


// Esto se ejecuta en cada tic del reloj. Con esto se pueden hacer animaciones
function onTic(Mundo){
  const snake = first(Mundo.snake);
  const comida = Mundo.food;
  //console.log("snake x: " + snake.x);
  //console.log("snake y: " + snake.y);
  //console.log("comida x: " + comida.x);
  //console.log("comida y: " + comida.y);
  if (snake.x == (comida.x)/dx && snake.y == (comida.y)/dy) {
    Mundo.snake.push({x: snake.x, y: snake.y});
    return updateFood();
  }
  else return update(Mundo, {snake: moveSnake(Mundo.snake, Mundo.dir)});
}

//Implemente esta función si quiere que su programa reaccione a eventos del mouse
function onMouseEvent (Mundo, event) {
   return update(Mundo,{});
}


/**
* Actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo stado del mundo
*/
function onKeyEvent (Mundo, keyCode) {
  // Cambiamos la dirección de la serpiente. Noten que no movemos la serpiente. Solo la dirección
  switch (keyCode) {
    case UP_ARROW:
      return update(Mundo, {dir: {y: -1, x: 0}});
      break;
    case DOWN_ARROW:
      return update(Mundo, {dir: {y: 1, x: 0}});
      break;
    case LEFT_ARROW:
      return update(Mundo, {dir: {y: 0, x: -1}});
      break;
    case RIGHT_ARROW:
      return update(Mundo, {dir: {y: 0, x: 1}});
      break;
    /*case 74:
      return update(Mundo, {food: {x: food2(), y: food2()}});
      break;*/
    default:
      console.log(keyCode);
      return update(Mundo, {});
  }
}

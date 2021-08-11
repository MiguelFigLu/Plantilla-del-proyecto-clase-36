var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Alimentar al perro");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Agregar comida");
  addFood.position(1000,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Última hora de comida : "+ lastFed%12 + " PM", 200,30);
   }else if(lastFed==0){
     text("Última hora de comida : 12 AM",200,30);
   }else{
     text("Última hora de comida : "+ lastFed + " AM", 200,30);
   }
 
  drawSprites();
}

//función para leer la comida del almacén
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//función para actualizar la comida del almacén y la última hora de comida
function feedDog(){
  dog.addImage(happyDog);
  
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//función para agregar comida al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

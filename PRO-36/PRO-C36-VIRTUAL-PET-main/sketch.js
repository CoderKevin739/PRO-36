var database;
var dog,sadImage,happyDog;

var foodImage,foodStock;
var fedTime;
var foodObj;
var value;
var milkimg,milkbottle;

var feed,lastFed;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
  milkImg=loadImage("Milk.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800, 400);

  foodObj=new Food();

  dog = createSprite(700,250);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed your dog");
  feed.position(700,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(850,100);
  addFood.mousePressed(addFoods);

  milkbottle = createSprite(610,270)
  milkbottle.addImage(milkImg)
  milkbottle.visible = true;
  milkbottle.scale = 0.1
}


function draw() {  
  background("lime");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
  })

  fill("black");
  textSize(18);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 150,35);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,35);
   }

   drawSprites();
}

function feedDog(){
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0){
    foodObj.foodStock=0;
    milkbottle.visible=false;
    dog.addImage(sadDog);
  }
  else{
    dog.addImage(happyDog);
    if(foodObj.foodStock===1){
        milkbottle.visible=false;
        dog.addImage(sadDog);
    }
    milkbottle.visible=true;
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}


function addFoods(){
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
  Food:foodObj.foodStock
  })
}
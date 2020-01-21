
var dayText = document.getElementById("dayArea");
// Parsing elements for resizing
var canvasElement = document.getElementById("myGame");
canvasElement.width = (window.innerWidth * 3 / 4);
canvasElement.height = window.innerHeight;
// Variables
var settings = {
    width : canvasElement.offsetWidth,
    height : canvasElement.offsetHeight,
    day: 0,
    dayPerSecond: 1,
    whale: {
        initPop: 1,
        avgLifetime: 14,
        breedingFreq: 8,
        avgBaby: 2,
        babyProbability: 1,
        nutritionPerDay: 1
    },
    angler: {
        initPop: 10,
        avgLifetime: 25,
        breedingFreq: 5,
        avgBaby: 2,
        babyProbability: 1,
        nutritionPerDay: 1
    },
    seaweed: {
        initPop: 100,
        breedingFreq: 5,
        avgBaby: 1,
        babyProbability: 1
    },
}
whales = [];
anglers = [];
seaweeds = [];

var stats = {
    whale: {
        born: 0,
        deadHunger: 0,
        deadLifetime: 0
    },
    angler: {
        born: 0,
        deadHunger: 0,
        deadLifetime: 0,
        eatenByWhale: 0
    },
    seaweed: {
        born: 0,
        eatenByAngler: 0
    }
};

function endStats(){
    console.log("---Whale Stats---");
    console.log(stats.whale.born + " healthy whale had borned");
    console.log(stats.whale.deadHunger + " whale had dead because of hunger");
    console.log(stats.whale.deadLifetime + " whale had dead because of lifetime");
    console.log("---Angler Stats---");
    console.log(stats.angler.born + " healthy angler had borned");
    console.log(stats.angler.eatenByWhale + " had eaten by whale");
    console.log(stats.angler.deadHunger + " angler had dead because of hunger");
    console.log(stats.angler.deadLifetime + " angler had dead because of lifetime");
    console.log("---Seaweed Stats---");
    console.log(stats.seaweed.born + " seaweed had breeded");
    console.log(stats.seaweed.eatenByAngler + " seaweed had eaten by angler");
}

// Game engine part
var Q = Quintus({development:false}).include("Sprites, Scenes, Anim").setup("myGame");

Q.Sprite.extend("Whale", {
    init: function(p) {
        this._super({
            sprite: "Whale",
            sheet: "Whale",
            frame: 1,
            x : settings.width * Math.random(),
            y: settings.height * Math.random(),
            vx: (Math.random() < 0.5) ? 1 : -1,
            vy: 1,
        });
        this.age = 1;
        this.add("animation")
    },
    step: function(dt) {
        if(this.p.x > settings.width || this.p.x < 0){
            this.p.vx *= -1
        }
        if(this.p.y > settings.height || this.p.y < 0 || Math.random() < 0.1){
            this.p.vy *= -1
        }
        this.p.x += this.p.vx;
        this.p.y += this.p.vy;
        if(this.p.vx > 0){
            this.play("swim_right");
        }else{
            this.play("swim_left");
        }
      }
});

Q.Sprite.extend("Angler", {
    init: function(p) {
        this._super({
            sprite: "Angler",
            sheet: "Angler",
            frame: 1,
            x : settings.width * Math.random(),
            y: settings.height * Math.random(),
            vx: (Math.random() < 0.5) ? 1 : -1,
            vy: 1,
        });
        this.age = 1;
        this.add("animation")
    },
    step: function(dt) {
        if(this.p.x > settings.width || this.p.x < 0){
            this.p.vx *= -1
        }
        if(this.p.y > settings.height || this.p.y < 0 || Math.random() < 0.1){
            this.p.vy *= -1
        }
        this.p.x += this.p.vx;
        this.p.y += this.p.vy;
        if(this.p.vx > 0){
            this.play("swim_right");
        }else{
            this.play("swim_left");
        }
      }
});

Q.Sprite.extend("Seaweed", {
    init: function(p) {
        this._super({
            sprite: "Seaweed",
            sheet: "Seaweed",
            frame: 1,
            x : settings.width * Math.random(),
            y: settings.height - 18,
        });
        this.add("animation");
        if(Math.random() < 0.5){
            this.play("default");
        }else{
            this.play("default2");
        }
    },
});

Q.scene("simulation",function(stage) {
    var tmp_char; //Temporary variable for new objects
    // Initial population
    for(var i = 0; i < settings.whale.initPop; i++){
        tmp_char = new Q.Whale();
        stage.insert(tmp_char);
        whales.push(tmp_char);
        console.log("Whales initialized");
    }

    for(var i = 0; i < settings.angler.initPop; i++){
        tmp_char = new Q.Angler();
        stage.insert(tmp_char);
        anglers.push(tmp_char);
        console.log("Anglers initialized");
    }

    for(var i = 0; i < settings.seaweed.initPop; i++){
        tmp_char = new Q.Seaweed();
        stage.insert(tmp_char);
        seaweeds.push(tmp_char);
        console.log("Seaweeds initialized");
    }
    // Initial population



    // Update section for every seconds
    var mainLoop = setInterval(function(){
        dayText.innerText = "Month: " + settings.day

        if(whales.length == 0 || seaweeds.length == 0 || anglers.length == 0){
            setTimeout(function(){stage.pause()},100)
            clearInterval(mainLoop);
            endStats();
        }

        //seaweed
        if(settings.day % settings.seaweed.breedingFreq == 0){
            for(var i = 0; i < seaweeds.length; i++){
                for(var x = 0; x < settings.seaweed.avgBaby;x++){
                    if(Math.random() < settings.seaweed.babyProbability){
                        tmp_char = new Q.Seaweed();
                        stage.insert(tmp_char);
                        seaweeds.push(tmp_char);
                        console.log("New seaweed created")
                        stats.seaweed.born += 1;
                        i += 1;
                    }
                }
            }
        }
        //angler
        for(var i = 0; i < anglers.length ; i++ ){
            if(anglers[i].age > settings.angler.avgLifetime){
                anglers[i].destroy()
                anglers.splice(i,1)
                console.log("Angler has dead because of lifetime")
                stats.angler.deadLifetime += 1;
                i -= 1;
                continue;
            }
            if(anglers[i].age % settings.angler.breedingFreq == 0){
                for(var x = 0; x < settings.angler.avgBaby; x++){
                    if(Math.random() < settings.angler.babyProbability){
                        tmp_char = new Q.Angler();
                        stage.insert(tmp_char);
                        anglers.push(tmp_char);
                        console.log("Angler had breed a healthy baby")
                        stats.angler.born += 1;
                    }
                }
            }
            if(seaweeds.length < settings.dayPerSecond * settings.angler.nutritionPerDay){
                anglers[i].destroy()
                anglers.splice(i,1)
                console.log("Angler dead because of hunger")
                stats.angler.deadHunger += 1;
                i -= 1;
                continue;
            }else{
                for(var x= 0; x < settings.angler.nutritionPerDay;x++){
                    seaweeds[0].destroy();
                    seaweeds.splice(0,1);
                    console.log("Angler ate seaweed")
                    stats.seaweed.eatenByAngler += 1;
                }
            }
            anglers[i].age += settings.dayPerSecond;
        }


        //whales
        for(var i = 0; i < whales.length ; i++ ){
            if(whales[i].age > settings.whale.avgLifetime){
                whales[i].destroy();
                whales.splice(i,1);
                console.log("Whale is dead because of lifetime")
                stats.whale.deadLifetime += 1;
                i -= 1;
                continue;
            }
            if(whales[i].age % settings.whale.breedingFreq == 0){
                for(var x = 0; x < settings.whale.avgBaby; x++){
                    if(Math.random() < settings.whale.babyProbability){
                        tmp_char = new Q.Whale();
                        stage.insert(tmp_char);
                        whales.push(tmp_char);
                        console.log("Whale had breed a healty baby")
                        stats.whale.born += 1;
                    }
                }
            }
            if(anglers.length < settings.dayPerSecond * settings.whale.nutritionPerDay){
                whales[i].destroy()
                whales.splice(i,1)
                console.log("Whale is dead because of hunger")
                stats.whale.deadHunger += 1;
                i -= 1;
                continue;
            }else{
                for(var x = 0; x < settings.whale.nutritionPerDay; x++){
                    anglers[0].destroy()
                    anglers.splice(0,1);
                    console.log("Whale ate angler")
                    stats.angler.eatenByWhale += 1;
                }
            }
            whales[i].age += settings.dayPerSecond;
        }


        settings.day += settings.dayPerSecond;
        console.log("Month" + settings.day);
    },1000);
    // Update section for every seconds
  });

Q.load("tiles.png, tileset.json", function() {
    Q.compileSheets("tiles.png","tileset.json");
    
    //Sprite Animations
    Q.animations('Whale', {
        swim_right: { frames: [0,1,2,3,4,5,6,7,8,9], rate: 1/5}, 
        swim_left: { frames: [10,11,12,13,14,15,16,17,18,19], rate:1/5 }
    });
    Q.animations('Angler', {
        swim_right: { frames: [0,1,2,3], rate: 1/3}, 
        swim_left: { frames: [4,5,6,7], rate:1/3}
    });
    Q.animations('Seaweed', {
        default: { frames: [0,1], rate: 1/2},
        default2: { frames: [1,0], rate: 1/2}
    });
    //Sprite Animations
});
// Game engine part


// UI
var startButton = document.getElementById("startSimulation");
var saveButton = document.getElementById("saveVariables");

saveButton.onclick = function(){
    settings.whale.initPop = Number(document.getElementById("whaleInitPop").value);
    settings.whale.avgLifetime = Number(document.getElementById("whaleAvgLifetime").value);
    settings.whale.breedingFreq = Number(document.getElementById("whaleBreedingFreq").value);
    settings.whale.avgBaby = Number(document.getElementById("whaleAvgBaby").value);
    settings.whale.babyProbability = Number(document.getElementById("whalebabyProbability").value);
    settings.whale.nutritionPerDay = Number(document.getElementById("whaleNutrition").value);

    settings.angler.initPop = Number(document.getElementById("anglerInitPop").value);
    settings.angler.avgLifetime = Number(document.getElementById("anglerAvgLifetime").value);
    settings.angler.breedingFreq = Number(document.getElementById("anglerBreedingFreq").value);
    settings.angler.avgBaby = Number(document.getElementById("anglerAvgBaby").value);
    settings.angler.babyProbability = Number(document.getElementById("anglerbabyProbability").value);
    settings.angler.nutritionPerDay = Number(document.getElementById("anglerNutrition").value);

    settings.seaweed.initPop = Number(document.getElementById("swInitPop").value);
    settings.seaweed.breedingFreq = Number(document.getElementById("swBreedingFreq").value);
    settings.seaweed.avgBaby = Number(document.getElementById("swAvgBaby").value);
    settings.seaweed.babyProbability = Number(document.getElementById("swbabyProbability").value);

    settings.dayPerSecond = Number(document.getElementById("dayPerSecond").value);
    settings.day = 0;
}

startButton.onclick = function(){
    Q.clearStages();
    settings.day = 0
    whales = [];
    seaweeds = [];
    anglers = [];
    stats = {
        whale: {
            born: 0,
            deadHunger: 0,
            deadLifetime: 0
        },
        angler: {
            born: 0,
            deadHunger: 0,
            deadLifetime: 0,
            eatenByWhale: 0
        },
        seaweed: {
            born: 0,
            eatenByAngler: 0
        }
    };
    Q.stageScene("simulation");
};

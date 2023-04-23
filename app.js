// Configuration de la scène
const config = {
    width: 528,
    height: 880,
    type: Phaser.AUTO,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 600}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

// Initialisation du jeu
var game = new Phaser.Game(config)

// Déclaration des variables globales
let SPEED = 1.5   
let SPACE = 160
let currentBird = 0
let dernierTemps = 0
let score = 0

// Fonction qui retourne un nombre aléatoire pour la position initiale du tuyau
function randomInt() {
    max = config.height - ground1.height + tuyau.height/2
    min = SPACE + tuyau.height/2 + ground1.height/2
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return randomNumber
}

// Fonction qui charge les images nécessaires pour la scène
function preload() {
    this.load.image('background', 'images/background.png')
    this.load.image('ground', 'images/ground.png')
    this.load.image('tuyau', 'images/tuyau.png')
    this.load.image('tuyau_r', 'images/tuyau_r.png')

    this.load.image('bird1', 'images/bird1.png')
    this.load.image('bird2', 'images/bird2.png')
    this.load.image('bird3', 'images/bird3.png')
}

// Fonction qui crée tous les éléments de la scène
function create() {
    this.physics.start()

    // Ajout de l'image de fond
    this.add.image(config.width/2, config.height/2, 'background')

    // Ajout des deux sols qui se déplaceront à chaque frame
    ground1 = this.add.image(0, 0, 'ground')
    ground1.setPosition(config.width/2, config.height - ground1.height/2)
    this.physics.add.existing(ground1)
    ground1.body.allowGravity = false   
    ground2 = this.add.image(0, 0, 'ground')
    ground2.setPosition(1.5*config.width, ground1.y)
    this.physics.add.existing(ground2)
    ground2.body.allowGravity = false

    // Ajout des tuyau
    tuyau = this.add.image(0, 0, 'tuyau')
    this.physics.add.existing(tuyau)
    tuyau.body.allowGravity = false
    tuyau.setPosition(config.width + tuyau.width/2, randomInt())

    tuyau_r = this.add.image(0, 0, 'tuyau_r')
    this.physics.add.existing(tuyau_r)
    tuyau_r.body.allowGravity = false
    tuyau_r.setPosition(config.width + tuyau_r.width/2, tuyau.y - SPACE - tuyau.height)

    // Ajout de l'oiseau et de ses collisions avec les différents éléments
    birds = ["bird1", "bird2", "bird3"]
    bird = this.physics.add.image(config.width/2, config.height/2, "bird1")
    bird.body.collideWorldBounds = true

    // Ajout du texte qui servira à afficher le score du joueur
    text = this.add.text(10, 5, '0', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

    // Récupération des inputs clavier
    inputs = this.input.keyboard.createCursorKeys()
}
    
// Fonction qui met à jour la position des deux sols
function updateGround() {
    if (ground1.x - ground1.width/2 <= -config.width) {
        ground1.setPosition(config.width + ground1.width/2, ground1.y)
    }
    if (ground2.x - ground2.width/2 <= -config.width) {
        ground2.setPosition(config.width + ground2.width/2, ground2.y)
    }
    ground1.setPosition((ground1.x - SPEED), ground1.y) 
    ground2.setPosition((ground2.x - SPEED), ground2.y)
}

// Fonction qui met à jour la position du tuyau
function updateTuyaux() {
    if (tuyau.x + tuyau.width/2 < 0) {
        tuyau.setPosition(config.width + tuyau.width, randomInt())  
        tuyau_r.setPosition(config.width + tuyau_r.width, tuyau.y - SPACE - tuyau.height)
    }
    tuyau.setPosition((tuyau.x - SPEED), tuyau.y)
    tuyau_r.setPosition((tuyau_r.x - SPEED), tuyau_r.y)
}

//Fonction qui calcul et met à jour le score du joueur
function updateScore() {
    if (bird.x === tuyau.x) {
        score = score + 1
        text.text = score
    }
}

//Fonction qui met à jour la texture de l'oiseau, cette fonction s'execute toutes les 0.2 secondes
function updateBird() {
    currentBird = currentBird + 1
    bird.setTexture(birds[currentBird%birds.length])
}

function collision() {
    // rechargement de la scène
    this.scene.restart()
    score = 0
}

function update() {
    if (inputs.space.isDown){       
        bird.setVelocity(0, -300)
    }

    // appel des fonctions d'update
    let tempsActuel = this.time.now
    if (tempsActuel - dernierTemps > 200) {
        updateBird()
        dernierTemps = tempsActuel
    }
    updateGround()
    updateTuyaux()
    updateScore()

    // ajout de la détection de collision
    this.physics.add.overlap(bird, tuyau, collision, null, this)
    this.physics.add.overlap(bird, tuyau_r, collision, null, this)
    this.physics.add.overlap(bird, ground1, collision, null, this)
    this.physics.add.overlap(bird, ground2, collision, null, this)
}

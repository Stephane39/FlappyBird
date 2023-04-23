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
let bird
let inputs
let speed = 1
let SPACE = 160

// Fonction qui retourne un nombre aléatoire pour la position initiale du tuyau
function randomInt() {
    max = config.height - ground1.height + tuyau.height/2
    min = SPACE + tuyau.height/2 + ground1.height/2
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return randomNumber
}

// Fonction qui charge les images nécessaires pour la scène
function preload() {
    this.load.image('bird', 'images/bird.png')
    this.load.image('background', 'images/background.png')
    this.load.image('ground', 'images/ground.png')
    this.load.image('tuyau', 'images/tuyau.png')
    this.load.image('tuyau_r', 'images/tuyau_r.png')
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
    bird = this.physics.add.image(config.width/2, config.height/2, "bird")
    bird.body.collideWorldBounds = true

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
    ground1.setPosition((ground1.x - speed), ground1.y) 
    ground2.setPosition((ground2.x - speed), ground2.y)
}

// Fonction qui met à jour la position du tuyau
function updateTuyaux() {
    if (tuyau.x + tuyau.width/2 < 0) {
        tuyau.setPosition(config.width + tuyau.width, randomInt())  
        tuyau_r.setPosition(config.width + tuyau_r.width, tuyau.y - SPACE - tuyau.height)
    }
    tuyau.setPosition((tuyau.x - speed), tuyau.y)
    tuyau_r.setPosition((tuyau_r.x - speed), tuyau_r.y)
}

function collision() {
    // rechargement de la scène
    this.scene.restart()
}

function update() {
    if (inputs.space.isDown){       
        bird.setVelocity(0, -300)
    }
    // appel des fonctions d'update du sol et des tuyaux
    updateGround()
    updateTuyaux()

    // ajout de la détection de collision
    this.physics.add.overlap(bird, tuyau, collision, null, this)
    this.physics.add.overlap(bird, tuyau_r, collision, null, this)
    this.physics.add.overlap(bird, ground1, collision, null, this)
    this.physics.add.overlap(bird, ground2, collision, null, this)
}

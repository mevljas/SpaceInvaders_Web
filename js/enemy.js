var startTime = 0;
var previousEnemyX = 0; //za racunanje odmika
var changeDirection = false;
var alreadyMovedDown = false; //prevents da se premaknejo veckrat - ker so 4 vrstice, 4 krat klicejo

function Enemy(x, y, row) {
    this.width = enemyWidth;
    this.height = enemyWidth;
    this.x = x;
    this.y = y;
    this.status = true;
    this.bullet = new Bullet(1);
    this.flyDown = false;
    this.row = row;
    this.lives = 1;
    this.speedY;
    this.oldY;


    if (row == -1) {
        this.sX = 20;
        this.sY = 635;
        this.sX2 = 20;
        this.sY2 = 635;
        this.sWidth = 123;
        this.sHeight = 57;
        this.width = enemyWidth * 2;
    } else if (row == 0) {
        this.sX = 18;
        this.sY = 13;
        this.sX2 = 164;
        this.sY2 = 13;
        this.sWidth = 111;
        this.sHeight = 80;
    } else if (row == 1) {
        this.sX = 312;
        this.sY = 13;
        this.sX2 = 428;
        this.sY2 = 13;
        this.sWidth = 81;
        this.sHeight = 80;
    } else if (row == 2) {
        this.sX = 19;
        this.sY = 133;
        this.sX2 = 160;
        this.sY2 = 133;
        this.sWidth = 120;
        this.sHeight = 80;
    } else if (row == 3) {
        this.sX = 236;
        this.sY = 493;
        this.sX2 = 346;
        this.sY2 = 493;
        this.sWidth = 79;
        this.sHeight = 79;
    }




    this.draw = function() {
        if (this.status) {
            if ((millis() - startTime) / 1000 <= 1) {
                image(invadersImage, this.x, this.y, this.width, this.height, this.sX, this.sY, this.sWidth, this.sHeight);
            } else if ((millis() - startTime) / 1000 <= 2) {
                image(invadersImage, this.x, this.y, this.width, this.height, this.sX2, this.sY2, this.sWidth, this.sHeight);
            } else {
                startTime = millis();
            }
        } else if (this.explosion) {
            image(invadersImage, this.x, this.y, this.width, this.height, 358, 632, 96, 55);
        }

    }
    this.collision = function() {
        //collision bottom canvas border
        if (level == 3 ) {
            if (this.y > height) {
                this.status = false;
            }
        }
        //collision z player
        if (this.y + this.height > player.y && this.y + this.height < player.y + player.height && this.x + this.width > player.x && this.x + this.width < player.x + player.width ||
            this.y + this.height > player.y && this.y + this.height < player.y + player.height && this.x < player.x + player.width && this.x > player.x) {
            player.lives--;
            this.status = false;
            explosion(this);
            enemiesAlive--;
        }
    }
    this.update = function() {
        if (this.status) {
            if (level < 3) {
                if (this.flyDown) {
                    if (this.y > height) {
                        this.y = 0;
                    }
                    this.y += this.speedY;
                    if (this.y <= this.oldY && this.y >= this.oldY - this.height) { //parkira na mesto
                        this.flyDown = false;
                        this.y = this.oldY;
                    }

                } else if (this.x + this.width + speedX >= width - this.width || this.x + speedX <= this.width) { // +  ker je speed - 
                    if (level == 2 && !alreadyMovedDown) {
                        alreadyMovedDown = true;
                        dropDownAndReverse();
                    }
                    changeDirection = true;

                }
                if(!changeDirection)
                    this.x += speedX;
            } else if (level == 3) {
                this.y += this.speedY;
            }
            this.collision();
        }

    }

}
enemies = new Array();

function makeEnemies() {
    enemyWidth = width / 20; //dinamicna veliksot enemy
    speedX = width / 900;
    //naredi array of enemies
    for (var i = 0; i < 4; i++) {
        enemies[i] = new Array();
        for (var j = 0; j < 10; j++) {
            enemies[i][j] = new Enemy(enemyWidth + j * enemyWidth * 1.5, enemyWidth * 2 + i * enemyWidth * 1.3, i);
            if (level == 3) {
                //v level 3 jih damo use na false da se en pokazejo
                enemies[i][j].status = false;
            }

        }
    }
    enemiesAlive = enemies.length * enemies[0].length; //stevilo enemies
    if (level < 3) {
        //zgornji ship / boss
        boss = new Enemy(enemyWidth * 7, enemyWidth / 2 , -1);
        boss.lives = 3;
        enemiesAlive++;
        boss.bullet.width = boss.bullet.width * 2;
        boss.bullet.height = boss.bullet.height * 2;
        boss.bullet.damage = 2;
    }




}

function updateEnemies() {
    if (level < 3) {
        boss.update();
        enemyShoot(boss);
        boss.bullet.update();
    }

    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < enemies[i].length; j++) {
            if (enemies[i][j]) {
                enemies[i][j].update();
                if (enemies[i][j].bullet)
                    enemies[i][j].bullet.update();
            }
        }
    }
    alreadyMovedDown = false;
    if(changeDirection){
        changeDirection = false;
        speedX = speedX * -1;
    }


}

function drawEnemies() {
    if (level < 3) {
        boss.draw();
        boss.bullet.draw();
    }
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < enemies[i].length; j++) {
            enemies[i][j].draw();
            if (enemies[i][j].bullet) {
                enemies[i][j].bullet.draw();
            }

        }
    }


}

function enemyShoot(enemy) {
    if (enemy == undefined) { //normalen enmey, ne boss
        var breakFromLoop = false;
        for (var i = 0; i < enemies.length; i++) {
            for (var j = 0; j < enemies[i].length; j++) {
                if (player.x + player.width > enemies[i][j].x && player.x + player.width < enemies[i][j].x + enemies[i][j].width ||
                    player.x < enemies[i][j].x + enemies[i][j].width && player.x > enemies[i][j].x) {

                    if (enemies[i][j] && enemies[i][j].status && !enemies[i][j].bullet.status && (Math.floor(Math.random() * 6 + 1)) == 1) {
                        enemies[i][j].bullet.x = enemies[i][j].x + enemies[i][j].width / 2;
                        enemies[i][j].bullet.y = enemies[i][j].y;
                        enemies[i][j].bullet.status = true;
                        breakFromLoop = true;
                        break; //da naredi samo en bullet
                    }
                }
            }
            if (breakFromLoop)
                break;
        }

    } else { //boss   
        if (player.x + player.width > enemy.x && player.x + player.width < enemy.x + enemy.width ||
            player.x < enemy.x + enemy.width && player.x > enemy.x) {

            if (enemy && enemy.status && !enemy.bullet.status && (Math.floor(Math.random() * 10 + 1)) == 1) {
                enemy.bullet.x = enemy.x + enemy.width / 2;
                enemy.bullet.y = enemy.y;
                enemy.bullet.status = true;

            }

        }

    }


}


function explosion(enemy) {
    enemy.explosion = true;
    explosionSound.play();
    setTimeout(function() {
        enemy.explosion = false;
    }, 1000);
}

function dropDownAndReverse() { //move one line down
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < enemies[i].length; j++) {
            enemies[i][j].y += enemies[i][j].height;
            // da najde pravo pozicjo ko pride nazj
            if (enemies[i][j].flyDown) {
                enemies[i][j].oldY += enemies[i][j].height ;
            }


        }
    }
    if(changeDirection){
        changeDirection = false;
        speedX = speedX * -1;
    }
}

function doFlyDown() { //start flying down
    
    var breakLoop = false;
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < enemies[i].length; j++) {
            if (!enemies[i][j].flyDown && Math.floor(Math.random() * 3 + 1) == 1) {
                enemies[i][j].oldY = enemies[i][j].y;
                enemies[i][j].flyDown = true;
                enemies[i][j].speedY = Math.random() * 4 + 1;
                breakLoop = true;
                break;
            }
        }
        if (breakLoop) {
            break;
        }
    }
}

function MakeEnemiesVisible() { //pokaze enemies - leve 3
    var breakFromLoop = false;
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < enemies[i].length; j++) {
            if (!enemies[i][j].status) { //ce je status false
                //random x
                var x = Math.random() * ((width - enemyWidth) - enemyWidth) + enemyWidth;
                //preveri odmik
                if (abs(previousEnemyX - x) < enemyWidth) { //preveri ce sta zadosti narazen
                    continue; //next enemy
                }
                previousEnemyX = x;
                //enemy z random sliko
                enemies[i][j] = new Enemy(x, -enemyWidth, (Math.floor(Math.random() * 3 + 1)));
                enemies[i][j].speedY = Math.random() * 4 + 1; //random speed
                enemies[i][j].status = true;
                breakFromLoop = true; //da anreidmo samo 1 enemy
                break;
            }
        }
        if (breakFromLoop)
            break;
    }
}
var wallsAlive = 6;

function Wall(x, y) {
    this.x = x;
    this.y = y;
    this.width = wallWidth;
    this.height = height / 7;
    this.status = true;
    this.lives = 4;


    this.draw = function() {
        if (this.status) {
            if (this == walls[0] || this == walls[2] || this == walls[4]) {
                if (this.lives == 3 || this.lives == 4) {
                    image(wallLeftImage, this.x, this.y, this.width, this.height);
                } else {
                    image(wallLeftBrokenImage, this.x, this.y, this.width, this.height);
                }
            } else {
                if (this.lives == 3 || this.lives == 4) {
                    image(wallRightImage, this.x, this.y, this.width, this.height);
                } else {
                    image(wallRightBrokenImage, this.x, this.y, this.width, this.height);
                }
            }
        }
    }
    this.update = function() {
        if (this.status) {
            if (this.lives < 1) {
                this.status = false;
                wallsAlive--;
            }
        }

    }

}


walls = new Array();

function makeWalls() {
    wallWidth = width / 9; //dinamicna velikost walla
    for (var i = 0; i < 6; i++) {
        if (i < 2) {
            walls[i] = new Wall((width / 2 - wallWidth * 3.5) + (i * (wallWidth - (width / width * 5))), height / 1.6); //odstevami da ni crte vmes med slikama
        } else if (i < 4) {
            walls[i] = new Wall((width / 2 - wallWidth * 3) + (i * (wallWidth - (width / width * 5))), height / 1.6);
        } else {
            walls[i] = new Wall((width / 2 - wallWidth * 2.5) + (i * (wallWidth - (width / width * 5))), height / 1.6);
        }

    }
}

function updateWalls() {
    for (var i = 0; i < 6; i++) {
        walls[i].update();
    }

}

function drawWalls() {
    for (var i = 0; i < 6; i++) {
        walls[i].draw();
    }


}
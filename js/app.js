function Tile(options) {
    this.element = document.createElement('div');
    this.value = options.value;
    this.position = {
        x: options.position.x,
        y: options.position.y
    };
    this.isJoined = false;
}
Tile.prototype.move = function (newPosition) {
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
};
Tile.prototype.render = function () {
    var top = this.position.y * 100 + this.position.y * 5,
        left = this.position.x * 100 + this.position.x * 5;
    this.element.style.cssText = 'top: ' + top + 'px; left: ' + left + 'px;';
    this.element.className = 'fade thing t' + this.value;
    this.isJoined = false;
    return this.element;
};

var Game = (function () {
    var bestScore = localStorage.getItem('bestScore') || 0,
        gameScore = 0,
        NewGame;

    var playfield = document.getElementById('playfield'),
        gameover = document.getElementById('gameover'),
        currentScoreEl = document.getElementById('currentscore'),
        bestScoreEl = document.getElementById('bestscore');

    NewGame = function () {
        this.tileList = [
            new Array(4),
            new Array(4),
            new Array(4),
            new Array(4)
        ]
    };

    NewGame.prototype.__randomTile = function () {
        var randomPos = {
            x: Math.floor(Math.random() * 4),
            y: Math.floor(Math.random() * 4)
        };

        while (this.tileList[randomPos.x][randomPos.y] !== undefined) {
            randomPos = {
                x: Math.floor(Math.random() * 4),
                y: Math.floor(Math.random() * 4)
            };
        }

        this.tileList[randomPos.x][randomPos.y] = new Tile({
            value: Math.random() * 10 > 9 ? 4 : 2,
            position: randomPos
        });
        playfield.appendChild(this.tileList[randomPos.x][randomPos.y].element)
    };

    NewGame.prototype.__removeTile = function (tile) {
        this.tileList[tile.position.x][tile.position.y] = undefined;
        playfield.removeChild(tile.element);
    };
    NewGame.prototype.__moveAndJoin = function (tile, position) {
        tile.value *= 2;
        tile.isJoined = true;
        this.__removeTile(this.tileList[position.x][position.y]);
        this.tileList[position.x][position.y] = tile;
        return tile.value;
    };
    NewGame.prototype.__moveTile = function (tile, dx, dy) {
        if (!tile) return -1;
        if (dx < 0 && tile.position.x === 0) return -1;
        if (dx > 0 && tile.position.x === 3) return -1;
        if (dy < 0 && tile.position.y === 0) return -1;
        if (dy > 0 && tile.position.y === 3) return -1;


        var newPos = {
                x: tile.position.x,
                y: tile.position.y
            },
            reward = 0;

        do {
            if (dx < 0 && newPos.x === 0) break;
            if (dx > 0 && newPos.x === 3) break;
            if (dy < 0 && newPos.y === 0) break;
            if (dy > 0 && newPos.y === 3) break;
            newPos.x = newPos.x + dx;
            newPos.y = newPos.y + dy;
        } while (this.tileList[newPos.x][newPos.y] === undefined);

        if (this.tileList[newPos.x][newPos.y] === undefined) {
            this.tileList[newPos.x][newPos.y] = tile;
        } else if (!this.tileList[newPos.x][newPos.y].isJoined && this.tileList[newPos.x][newPos.y].value === tile.value) {
            reward = this.__moveAndJoin(tile, newPos)
        } else if (this.tileList[newPos.x - dx][newPos.y - dy] === undefined) {
            newPos.x = newPos.x - dx;
            newPos.y = newPos.y - dy;
            this.tileList[newPos.x][newPos.y] = tile;
        } else {
            return -1;
        }

        this.tileList[tile.position.x][tile.position.y] = undefined;
        tile.move(newPos);

        return reward;

    };
    NewGame.prototype.moveTiles = function (direction) {
        var score = 0;
        var isMoved = false;

        for (var column = 0; column < 4; column++) {
            for (var row = 0; row < 4; row++) {
                switch (direction) {
                    case 'left':
                        score = this.__moveTile(this.tileList[column][row], -1, 0);
                        break;
                    case 'right':
                        score = this.__moveTile(this.tileList[3 - column][row], 1, 0);
                        break;
                    case 'up':
                        score = this.__moveTile(this.tileList[column][row], 0, -1);
                        break;
                    case 'down':
                        score = this.__moveTile(this.tileList[column][3 - row], 0, 1);
                        break;
                    default: return;
                }

                if (score !== -1) {
                    gameScore += score;
                    isMoved = true;
                }
            }
        }

        if (isMoved) {
            this.__randomTile();
            if (this.checkGameOver()) gameover.style.zIndex = '100';
        }
    };

    NewGame.prototype.checkGameOver = function () {
        var isGameOver = false;
        for (var column = 0; column < 4; column++) {
            for (var row = 0; row < 4; row++) {

                var curentTile = this.tileList[column][row],
                    rightTile = column < 3 ? this.tileList[column+1][row] : undefined,
                    bottomTile = row < 3 ? this.tileList[column][row+1] : undefined;

                if (curentTile === undefined) {
                    return false;
                }

                if (bottomTile && curentTile.value === bottomTile.value) {
                    return false;
                }

                if (rightTile && curentTile.value === rightTile.value) {
                    return false;
                }

                isGameOver = true;
            }
        }
        return isGameOver;
    };

    NewGame.prototype.reset = function () {
        var self = this;
        this.tileList.filter(Boolean).forEach(function(column) {
            column.filter(Boolean).forEach(function (tile) {
                self.__removeTile(tile);
            })
        });
        gameover.style.zIndex = '-1';
        gameScore = 0;
        this.__randomTile();
        this.render();
    };

    NewGame.prototype.render = function () {
        bestScore = gameScore > bestScore ? gameScore : bestScore;
        currentScoreEl.textContent = gameScore;
        bestScoreEl.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);

        this.tileList.filter(Boolean).forEach(function(column) {
            column.filter(Boolean).forEach(function (tile) {
                tile.render()
            })
        })
    };

    return NewGame;
})();

function Mouse() {
    this.downX = 0;
    this.downY = 0;
    this.upX = 0;
    this.upY = 0;
}
Mouse.prototype.getDirection = function () {
    var direction = '';

    if (this.upX < this.downX && Math.abs(this.upX - this.downX) > Math.abs(this.upY - this.downY)) {
        direction = 'left'
    }
    if (this.upX > this.downX && Math.abs(this.upX - this.downX) > Math.abs(this.upY - this.downY)) {
        direction = 'right'
    }
    if (this.upY < this.downY && Math.abs(this.upX - this.downX) < Math.abs(this.upY - this.downY)) {
        direction = 'up'
    }
    if (this.upY > this.downY && Math.abs(this.upX - this.downX) < Math.abs(this.upY - this.downY)) {
        direction = 'down'
    }

    return direction;
};
Mouse.prototype.onMouseDown = function (event) {
    this.downX = event.pageX;
    this.downY = event.pageY;
};
Mouse.prototype.onMouseUp = function (event) {
    this.upX = event.pageX;
    this.upY = event.pageY;
};


window.onload = function () {
    var resetBtn = document.getElementById('reset');
    var playfield = document.getElementById('playfield');

    var game = new Game(),
        mouse = new Mouse();

    game.reset();

    document.addEventListener('keydown', function (e) {
        switch (e.which) {
            case 37: game.moveTiles('left');  break;
            case 38: game.moveTiles('up');    break;
            case 39: game.moveTiles('right'); break;
            case 40: game.moveTiles('down');  break;
            default: return;
        }

        game.render();
    });

    playfield.addEventListener('mousedown', function (e) {
        mouse.onMouseDown(e)
    });

    playfield.addEventListener('touchstart', function (e) {
        var touchEvent = e.touches[0];
        mouse.onMouseDown(touchEvent);
    });

    playfield.addEventListener('mouseup', function (e) {
        mouse.onMouseUp(e);
        game.moveTiles(mouse.getDirection());
        game.render();
    });

    playfield.addEventListener('touchend', function (e) {
        var touchEvent = e.changedTouches[0];
        mouse.onMouseUp(touchEvent);
        game.moveTiles(mouse.getDirection());
        game.render();
    });

    resetBtn.addEventListener('click', function () {
        game.reset()
    })
};
function Tile(options) {
    this.element = document.createElement('div')
    this.value = options.value;
    this.position = {
        x: options.position.x,
        y: options.position.y
    }
    this.isJoined = false;
}
Tile.prototype.move = function (newPosition) {
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
};
Tile.prototype.render = function () {
    var top = this.position.y * 100,
        left = this.position.x * 100
    this.element.style.cssText = 'top: ' + top + 'px; left: ' + left + 'px;';
    this.element.className = 'fade thing t' + this.value;
    this.isJoined = false;
    return this.element;
}

var Game = (function () {
    var bestScore = localStorage.getItem('bestScore') || 0,
        gameScore = 0,
        NewGame

    var playfield = document.getElementById('playfield'),
        gameover = document.getElementById('gameover'),
        currentScoreEl = document.getElementById('currentscore'),
        bestScoreEl = document.getElementById('bestscore');

    NewGame = function () {
        this.tailList = [
            new Array(4),
            new Array(4),
            new Array(4),
            new Array(4)
        ]
    }

    NewGame.prototype.randomTail = function () {
        var randomPos = {
            x: Math.floor(Math.random() * 4),
            y: Math.floor(Math.random() * 4)
        };

        while (this.tailList[randomPos.x][randomPos.y] !== undefined) {
            randomPos = {
                x: Math.floor(Math.random() * 4),
                y: Math.floor(Math.random() * 4)
            };
        }

        this.tailList[randomPos.x][randomPos.y] = new Tile({
            value: Math.random() * 10 > 9 ? 4 : 2,
            position: randomPos
        })
        playfield.appendChild(this.tailList[randomPos.x][randomPos.y].element)
    }

    NewGame.prototype.removeTail = function (tile) {
        this.tailList[tile.position.x][tile.position.y] = undefined;
        playfield.removeChild(tile.element);
    }

    NewGame.prototype.moveAndJoin = function (tile, position) {
        tile.value *= 2;
        tile.isJoined = true;
        this.removeTail(this.tailList[position.x][position.y]);
        this.tailList[position.x][position.y] = tile;
        return tile.value;
    }

    NewGame.prototype.__moveLeft = function (tile) {
        if (!tile || tile.position.x === 0) return;

        var newPos = {
                x: tile.position.x,
                y: tile.position.y
            },
            reward = 0;

        do {
            newPos.x -= 1;
        } while (this.tailList[newPos.x][newPos.y] === undefined && newPos.x > 0)

        if (this.tailList[newPos.x][newPos.y] === undefined) {
            this.tailList[newPos.x][newPos.y] = tile;
        } else if (!this.tailList[newPos.x][newPos.y].isJoined && this.tailList[newPos.x][newPos.y].value === tile.value) {
            reward = this.moveAndJoin(tile, newPos)
        } else if (this.tailList[newPos.x+1][newPos.y] === undefined) {
            this.tailList[++newPos.x][newPos.y] = tile;
        } else {
            return;
        }

        this.tailList[tile.position.x][tile.position.y] = undefined;
        tile.move(newPos);

        return reward;
    }
    NewGame.prototype.__moveRight = function (tile) {
        if (!tile || tile.position.x === 3) return;

        var newPos = {
                x: tile.position.x,
                y: tile.position.y
            },
            reward = 0;

        do {
            newPos.x += 1;
        } while (this.tailList[newPos.x][newPos.y] === undefined && newPos.x < 3)

        if (this.tailList[newPos.x][newPos.y] === undefined) {
            this.tailList[newPos.x][newPos.y] = tile;
        } else if (!this.tailList[newPos.x][newPos.y].isJoined && this.tailList[newPos.x][newPos.y].value === tile.value) {
            reward = this.moveAndJoin(tile, newPos)
        } else if (this.tailList[newPos.x-1][newPos.y] === undefined) {
            this.tailList[--newPos.x][newPos.y] = tile;
        } else {
            return;
        }

        this.tailList[tile.position.x][tile.position.y] = undefined;
        tile.move(newPos);

        return reward;
    }
    NewGame.prototype.__moveUp = function (tile) {
        if (!tile || tile.position.y === 0) return;

        var newPos = {
                x: tile.position.x,
                y: tile.position.y
            },
            reward = 0;

        do {
            newPos.y -= 1;
        } while (this.tailList[newPos.x][newPos.y] === undefined && newPos.y > 0)

        if (this.tailList[newPos.x][newPos.y] === undefined) {
            this.tailList[newPos.x][newPos.y] = tile;
        } else if (!this.tailList[newPos.x][newPos.y].isJoined && this.tailList[newPos.x][newPos.y].value === tile.value) {
            reward = this.moveAndJoin(tile, newPos)
        } else if (this.tailList[newPos.x][newPos.y+1] === undefined) {
            this.tailList[newPos.x][++newPos.y] = tile;
        } else {
            return;
        }

        this.tailList[tile.position.x][tile.position.y] = undefined;
        tile.move(newPos);

        return reward;
    }
    NewGame.prototype.__moveDown = function (tile) {
        if (!tile || tile.position.y === 3) return;

        var newPos = {
                x: tile.position.x,
                y: tile.position.y
            },
            reward = 0;

        do {
            newPos.y += 1;
        } while (this.tailList[newPos.x][newPos.y] === undefined && newPos.y < 3)

        if (this.tailList[newPos.x][newPos.y] === undefined) {
            this.tailList[newPos.x][newPos.y] = tile;
        } else if (!this.tailList[newPos.x][newPos.y].isJoined && this.tailList[newPos.x][newPos.y].value === tile.value) {
            reward = this.moveAndJoin(tile, newPos)
        } else if (this.tailList[newPos.x][newPos.y-1] === undefined) {
            this.tailList[newPos.x][--newPos.y] = tile;
        } else {
            return;
        }

        this.tailList[tile.position.x][tile.position.y] = undefined;
        tile.move(newPos);

        return reward;
    }
    NewGame.prototype.moveTails = function (direction) {
        var score = 0;
        var isMoved = false;

        for (var column = 0; column < 4; column++) {
            for (var row = 0; row < 4; row++) {
                switch (direction) {
                    case 'left':
                        score = this.__moveLeft(this.tailList[column][row]);
                        break;
                    case 'right':
                        score = this.__moveRight(this.tailList[3 - column][row]);
                        break;
                    case 'up':
                        score = this.__moveUp(this.tailList[column][row]);
                        break;
                    case 'down':
                        score = this.__moveDown(this.tailList[column][3 - row]);
                        break;
                    default: return;
                }

                if (!isNaN(score)) {
                    gameScore += score;
                    isMoved = true;
                }
            }
        }

        if (isMoved) {
            this.randomTail();
            if (this.checkGameOver()) gameover.style.zIndex = '100';
        }
    }

    NewGame.prototype.checkGameOver = function () {
        var isGameOver = false;
        for (var column = 0; column < 4; column++) {
            for (var row = 0; row < 4; row++) {

                var curentTile = this.tailList[column][row],
                    rightTile = column < 3 ? this.tailList[column+1][row] : undefined,
                    bottomTile = row < 3 ? this.tailList[column][row+1] : undefined;

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
    }

    NewGame.prototype.reset = function () {
        var self = this;
        this.tailList.filter(Boolean).forEach(function(column) {
            column.filter(Boolean).forEach(function (tile) {
                self.removeTail(tile);
            })
        })
        gameover.style.zIndex = '-1';
        gameScore = 0;
        this.randomTail();
        this.render();
    }

    NewGame.prototype.render = function () {
        bestScore = gameScore > bestScore ? gameScore : bestScore;
        currentScoreEl.textContent = gameScore;
        bestScoreEl.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);

        this.tailList.filter(Boolean).forEach(function(column) {
            column.filter(Boolean).forEach(function (tile) {
                tile.render()
            })
        })
    }

    return NewGame;
})()

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
}
Mouse.prototype.onMouseDown = function (event) {
    this.downX = event.pageX;
    this.downY = event.pageY;
}
Mouse.prototype.onMouseUp = function (event) {
    this.upX = event.pageX;
    this.upY = event.pageY;
}


window.onload = function () {
    var resetBtn = document.getElementById('reset');
    var playfield = document.getElementById('playfield');

    var game = new Game(),
        mouse = new Mouse();

    game.reset();

    document.addEventListener('keydown', function (e) {
        switch (e.which) {
            case 37: game.moveTails('left');  break;
            case 38: game.moveTails('up');    break;
            case 39: game.moveTails('right'); break;
            case 40: game.moveTails('down');  break;
            default: return;
        }

        game.render();
    })

    playfield.addEventListener('mousedown', function (e) {
        mouse.onMouseDown(e)
    })

    playfield.addEventListener('touchstart', function (e) {
        var touchEvent = e.touches[0];
        mouse.onMouseDown(touchEvent);
    })

    playfield.addEventListener('mouseup', function (e) {
        mouse.onMouseUp(e)
        game.moveTails(mouse.getDirection());
        game.render();
    })

    playfield.addEventListener('touchend', function (e) {
        var touchEvent = e.changedTouches[0];
        mouse.onMouseUp(touchEvent)
        game.moveTails(mouse.getDirection());
        game.render();
    })

    resetBtn.addEventListener('click', function () {
        game.reset()
    })
}
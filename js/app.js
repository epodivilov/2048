function Tile(options) {
    this.element = document.createElement('div')
    this.value = options.value;
    this.position = options.position;
}
Tile.prototype.move = function (newPosition) {
    this.position = newPosition;
};
Tile.prototype.render = function () {
    var top = (this.position % 4) * 100,
        left = (this.position / 4 |0) * 100
    this.element.style.cssText = 'top: ' + top + 'px; left: ' + left + 'px;';
    this.element.className = 'fade thing t' + this.value;
    return this.element;
}

const Game = (() => {
    var bestScore = 0,
        gameScore = 0,
        NewGame

    var playfield = document.getElementById('playfield'),
        currentScoreEl = document.getElementById('currentscore'),
        bestScoreEl = document.getElementById('bestscore');

    NewGame = function () {
        this.tailList = new Array(16);
    }

    NewGame.prototype.randomTail = function () {
        var randomPos = Math.floor(Math.random() * this.tailList.length);

        while (this.tailList[randomPos] !== undefined) {
            randomPos = Math.floor(Math.random() * this.tailList.length);
        }

        this.tailList[randomPos] = new Tile({
            value: Math.random() * 10 > 9 ? 4 : 2,
            position: randomPos
        })
        playfield.appendChild(this.tailList[randomPos].element)
    }

    NewGame.prototype.removeTail = function (tile) {
        this.tailList[tile.position] = undefined;
        playfield.removeChild(tile.element);
    }

    NewGame.prototype.__moveLeft = function (tile) {
        if (!tile || tile.position < 4) return;

        var newPos = tile.position,
            reward = 0;

        do {
            newPos = newPos - 4;
        } while (this.tailList[newPos] === undefined && newPos > 3)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos].value === tile.value) {
            tile.value *= 2;
            reward = tile.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos+4] === undefined) {
            newPos = newPos + 4;
            this.tailList[newPos] = tile;
        } else {
            return;
        }

        this.tailList[tile.position] = undefined;
        tile.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveRight = function (tile) {
        if (!tile || tile.position > 11) return;

        let newPos = tile.position,
            reward = 0;

        do {
            newPos = newPos + 4;
        } while (this.tailList[newPos] === undefined && newPos < 12)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos].value === tile.value) {
            tile.value *= 2;
            reward = tile.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos-4] === undefined) {
            newPos = newPos - 4;
            this.tailList[newPos] = tile;
        } else {
            return;
        }

        this.tailList[tile.position] = undefined;
        tile.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveUp = function (tile) {
        if (!tile || tile.position % 4 === 0) return;

        var newPos = tile.position,
            reward = 0;

        do {
            newPos = newPos - 1;
        } while (this.tailList[newPos] === undefined && (newPos) % 4 !== 0)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos].value === tile.value) {
            tile.value *= 2;
            reward = tile.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos+1] === undefined) {
            newPos = newPos+1;
            this.tailList[newPos] = tile;
        } else {
            return;
        }

        this.tailList[tile.position] = undefined;
        tile.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveDown = function (tile) {
        if (!tile || [3,7,11,15].indexOf(tile.position) !== -1 ) return;

        var newPos = tile.position,
            reward = 0;

        do {
            newPos = newPos + 1;
        } while (this.tailList[newPos] === undefined && [3,7,11,15].indexOf(newPos) === -1)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos].value === tile.value) {
            tile.value *= 2;
            reward = tile.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tile;
        } else if (this.tailList[newPos-1] === undefined) {
            newPos = newPos-1;
            this.tailList[newPos] = tile;
        } else {
            return;
        }

        this.tailList[tile.position] = undefined;
        tile.move(newPos);
        return reward;
    }
    NewGame.prototype.moveTails = function (direction) {
        let score = 0;
        let isMoved = false;
        for (let i = 0, len = this.tailList.length; i < len; i++) {
            switch (direction) {
                case 'left':
                    score = this.__moveLeft(this.tailList[i]);
                    break;
                case 'right':
                    score = this.__moveRight(this.tailList[len-1-i]);
                    break;
                case 'up':
                    score = this.__moveUp(this.tailList[i]);
                    break;
                case 'down':
                    score = this.__moveDown(this.tailList[len-1-i]);
                    break;
                default: return;
            }

            if (!isNaN(score)) {
                gameScore += score;
                isMoved = true;
            }
        }

        if (isMoved) this.randomTail();
    }

    NewGame.prototype.reset = function () {
        var self = this;
        this.tailList.filter(Boolean).forEach(function(tile) {
            self.removeTail(tile);
        })

        gameScore = 0;
        this.randomTail();
        this.render();
    }

    NewGame.prototype.render = function () {
        bestScore = gameScore > bestScore ? gameScore : bestScore;
        currentScoreEl.textContent = gameScore;
        bestScoreEl.textContent = bestScore;

        this.tailList.filter(Boolean).forEach(function(tile) {
            tile.render()
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
        console.log(e);
        mouse.onMouseDown(e)
    })

    playfield.addEventListener('mouseup', function (e) {
        mouse.onMouseUp(e)
        game.moveTails(mouse.getDirection());
        game.render();
    })

    playfield.addEventListener('touchend', function (e) {
        console.log(e);
        mouse.onMouseUp(e)
        game.moveTails(mouse.getDirection());
        game.render();
    })

    resetBtn.addEventListener('click', function () {
        game.reset()
    })
}
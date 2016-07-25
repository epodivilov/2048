function Tail(options) {
    this.element = document.createElement('div')
    this.value = options.value;
    this.position = options.position;
}
Tail.prototype.move = function (newPosition) {
    this.position = newPosition;
};
Tail.prototype.render = function () {
    const top = (this.position % 4) * 100,
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
        let randomPos = Math.floor(Math.random() * this.tailList.length);

        while (this.tailList[randomPos] !== undefined) {
            randomPos = Math.floor(Math.random() * this.tailList.length);
        }

        this.tailList[randomPos] = new Tail({
            value: Math.random() * 10 > 9 ? 4 : 2,
            position: randomPos
        })
        playfield.appendChild(this.tailList[randomPos].element)
    }

    NewGame.prototype.removeTail = function (tail) {
        this.tailList[tail.position] = undefined;
        playfield.removeChild(tail.element);
    }

    NewGame.prototype.__moveLeft = function (tail) {
        if (!tail || tail.position < 4) return;

        let newPos = tail.position,
            reward = 0;

        do {
            newPos = newPos - 4;
        } while (this.tailList[newPos] === undefined && newPos > 3)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos].value === tail.value) {
            tail.value *= 2;
            reward = tail.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos+4] === undefined) {
            newPos = newPos + 4;
            this.tailList[newPos] = tail;
        } else {
            return;
        }

        this.tailList[tail.position] = undefined;
        tail.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveRight = function (tail) {
        if (!tail || tail.position > 11) return;

        let newPos = tail.position,
            reward = 0;

        do {
            newPos = newPos + 4;
        } while (this.tailList[newPos] === undefined && newPos < 12)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos].value === tail.value) {
            tail.value *= 2;
            reward = tail.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos-4] === undefined) {
            newPos = newPos - 4;
            this.tailList[newPos] = tail;
        } else {
            return;
        }

        this.tailList[tail.position] = undefined;
        tail.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveUp = function (tail) {
        if (!tail || tail.position % 4 === 0) return;

        let newPos = tail.position,
            reward = 0;

        do {
            newPos = newPos - 1;
        } while (this.tailList[newPos] === undefined && (newPos) % 4 !== 0)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos].value === tail.value) {
            tail.value *= 2;
            reward = tail.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos+1] === undefined) {
            newPos = newPos+1;
            this.tailList[newPos] = tail;
        } else {
            return;
        }

        this.tailList[tail.position] = undefined;
        tail.move(newPos);
        return reward;
    }
    NewGame.prototype.__moveDown = function (tail) {
        if (!tail || [3,7,11,15].indexOf(tail.position) !== -1 ) return;

        let newPos = tail.position,
            reward = 0;

        do {
            newPos = newPos + 1;
        } while (this.tailList[newPos] === undefined && [3,7,11,15].indexOf(newPos) === -1)

        if (this.tailList[newPos] === undefined) {
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos].value === tail.value) {
            tail.value *= 2;
            reward = tail.value;
            this.removeTail(this.tailList[newPos]);
            this.tailList[newPos] = tail;
        } else if (this.tailList[newPos-1] === undefined) {
            newPos = newPos-1;
            this.tailList[newPos] = tail;
        } else {
            return;
        }

        this.tailList[tail.position] = undefined;
        tail.move(newPos);
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
        this.tailList.filter(Boolean).forEach((tail) => {
            this.removeTail(tail);
        })

        gameScore = 0;
        this.randomTail();
        this.render();
    }

    NewGame.prototype.render = function () {
        bestScore = gameScore > bestScore ? gameScore : bestScore;
        currentScoreEl.textContent = gameScore;
        bestScoreEl.textContent = bestScore;

        this.tailList.filter(Boolean).forEach((tail) => {
            tail.render()
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



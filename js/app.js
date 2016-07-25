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

    return NewGame;
})()
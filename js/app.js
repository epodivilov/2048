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

    return NewGame;
})()
/* Задание
 *
 * 1.   Добавить управление +
 * 2.   Каждая из сторон при пресечении должна перемещать на противоположенную +
 * 3.   Добавить рандомное появление еды (подсказка: надо навешивать на ячейки класс food) +
 * 3,5. Добавить поедание змейкой еды. +
 * 4.   Размер змейки должен увеличиваться
 * 5*.  Научиться увеличивать сокрость игры при увеличении количества очков
 * 6**. Придумать новую фичу и реализовать
 * 
 */

var snakeGame = (function() {
    //Константы оформляются в особом стиле
    const WIDTH = 10;
    const HEIGHT = 10;

    let isFoodEaten = true;
    let scores = 0;

    let headX = 0;
    let headY = 0;
    let dx = 1;
    let dy = 0;
    let currentStep = 1;

    let playStep = () => {
        headX += dx;
        headY += dy;
        checkCoords(headX, headY);
        let newHeadCell = getCell(headX, headY);

        removeSnakeCells();

        checkForFood(newHeadCell);
        addSnakeToCell(newHeadCell);
        setCellStep(newHeadCell, currentStep);

        if (isFoodEaten) {
            spawnFood();
            isFoodEaten = false;
        }

        refreshScore(scores);
        currentStep++;
        return true;
    }

    let getScore = () => {
        return scores;
    }

    let checkForFood = headCell => {
        if (isFood(headCell)) {
            removeFoodFromCell(headCell);
            isFoodEaten = true;
            scores++;
        }
    }

    //При пересечении стороны перемещает на противоположную
    let checkCoords = (hX, hY) => {
        if (hX >= WIDTH) {
            headX = 0;
        }
        if (hX < 0) {
            headX = WIDTH - 1;
        }
        if (hY >= HEIGHT) {
            headY = 0;
        }
        if (hY < 0) {
            headY = HEIGHT - 1;
        }
    }

    let removeSnakeCells = () => {
        for (let snakeCell of getSnakeCells())
            removeSnakeFromCell(snakeCell);
    }

    let isFood = cell => {
        //indexOf возвращает -1, если входжений строки нет
        return cell.className.indexOf("food") != -1;
    }

    let getCell = (x, y) => {
        //console.log("Get cell x " + x + " y " + y);
        // Можно находить элементы DOM по id
        return document.getElementById(y + '_' + x);
    }

    let getSnakeCells = () => {
        // Можно находить элементы DOM по классу
        return document.getElementsByClassName('snake');
    }

    let addSnakeToCell = cell => {
        // Строчка className может включать несколько классов, например "class1 class2".
        // Поэтому добавляем пробел.
        cell.className += ' snake';
    }

    let addFoodToCell = cell => {
        // Строчка className может включать несколько классов, например "class1 class2".
        // Поэтому добавляем пробел.
        cell.className += ' food';
    }

    let removeSnakeFromCell = cell => {
        cell.className = cell.className.replace('snake', '');
    }

    let removeFoodFromCell = cell => {
        cell.className = cell.className.replace('food', '');
    }

    let setCellStep = (cell, step) => {
        // Есть соглашение, что пользовательские атрибуты называются с префикса "data-".
        cell.setAttribute('data-step', step);
    }

    let getCellStep = cell => {
        // Явное преобразование строки к числу через объект-обертку.
        return new Number(cell.getAttribute('data-step'));
    }

    let setDirection = (x, y) => {
        //Меняет направление, если аргументами не передается противоположное
        dx = (x == -dx) ? dx : x;
        dy = (y == -dy) ? dy : y;
    }

    let getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    let spawnFood = () => {
        let x = Math.round(getRandomNumber(0, WIDTH - 1));
        let y = Math.round(getRandomNumber(0, HEIGHT - 1));

        let foodCell = getCell(x, y);
        addFoodToCell(foodCell);
    }

    // Только этот объект будет доступен извне.
    return {
        getScore: getScore,
        playStep: playStep,
        setDirection: setDirection
    }
})(); // Используем IIFE (Immediately Invoked Function Expression) для изоляции.

// Главный цикл игры.
let timer = setInterval(function() {
    if (!snakeGame.playStep()) {
        // Игра закончена - останавливаем цикл.
        clearInterval(timer);
        alert('Game Over! Score: ' + snakeGame.getScore());
    }
    refreshScore(snakeGame.getScore());
}, 300);


let refreshScore = scores => {
    let scoreDiv = document.getElementById('scores');
    scoreDiv.innerHTML = scores;
}

// Обработка действий пользователя.
document.onkeydown = e => {
    switch (e.keyCode) {
        //w
        case (87):
            snakeGame.setDirection(0, -1);
            break;
            //a
        case (65):
            snakeGame.setDirection(-1, 0);
            break;
            //s
        case (83):
            snakeGame.setDirection(0, 1);
            break;
            //d
        case (68):
            snakeGame.setDirection(1, 0);
            break;
    }
}
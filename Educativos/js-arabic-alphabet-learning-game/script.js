const STAR_MAPPING = {
    5: '\u2605\u2605\u2605\u2605\u2605',
    4: '\u2605\u2605\u2605\u2605\u2606',
    3: '\u2605\u2605\u2605\u2606\u2606',
    2: '\u2605\u2605\u2606\u2606\u2606',
    1: '\u2605\u2606\u2606\u2606\u2606',
    0: '\u2606\u2606\u2606\u2606\u2606'
}

const REVERSE_STAR_MAPPING = {
    '\u2605\u2605\u2605\u2605\u2605': 5,
    '\u2605\u2605\u2605\u2605\u2606': 4,
    '\u2605\u2605\u2605\u2606\u2606': 3,
    '\u2605\u2605\u2606\u2606\u2606': 2,
    '\u2605\u2606\u2606\u2606\u2606': 1,
    '\u2606\u2606\u2606\u2606\u2606': 0
}

const LETTER_SOUNDS = {
    'ā': 'assets/letter_a_bar.mp3',
    'b': 'assets/letter_b.mp3',
    't': 'assets/letter_t.mp3',
    'th': 'assets/letter_th.mp3',
    'dj': 'assets/letter_dj.mp3',
    'ḥ': 'assets/letter_h_dot.mp3',
    'kh': 'assets/letter_kh.mp3',
    'd': 'assets/letter_d.mp3',
    'dh': 'assets/letter_dh.mp3',
    'r': 'assets/letter_r.mp3',
    'z': 'assets/letter_z.mp3',
    's': 'assets/letter_s.mp3',
    'sh': 'assets/letter_sh.mp3',
    'ṣ': 'assets/letter_s_dot.mp3',
    'ḍ': 'assets/letter_d_dot.mp3',
    'ṭ': 'assets/letter_t_dot.mp3',
    'ẓ': 'assets/letter_z_dot.mp3',
    'ʿ / ‘': 'assets/letter_3.mp3',
    'gh': 'assets/letter_3_dot.mp3',
    'f': 'assets/letter_f.mp3',
    'q': 'assets/letter_q.mp3',
    'k': 'assets/letter_k.mp3',
    'l': 'assets/letter_l.mp3',
    'm': 'assets/letter_m.mp3',
    'n': 'assets/letter_n.mp3',
    'h': 'assets/letter_h.mp3',
    'ou': 'assets/letter_w.mp3',
    'i': 'assets/letter_y.mp3',
}

const WORD_SOUNDS = {
    'ح ب ي ب ي': 'assets/habibi.mp3',
    'خ ي ار': 'assets/khiar.mp3',
    'ت ب و ل ة': 'assets/tabboule.mp3',
    'ث و م': 'assets/thoum.mp3',
    'د ج ا ج': 'assets/djedj.mp3',
    'ذ ر ة': 'assets/dhara.mp3',
    'ر ز': 'assets/roz.mp3',
    'ش م س': 'assets/shams.mp3',
    'ص و ص أ ص ف ر': 'assets/souss asfar.mp3',
    'ض و': 'assets/daouw.mp3',
    'ب ط ا ط ا': 'assets/batata.mp3',
    'ظ ل': 'assets/zol.mp3',
    'ع ي د ا': 'assets/aida.mp3',
    'غ س ل ا ل ي د ي ن': 'assets/rassil al idain.mp3',
    'ق م ر': 'assets/qamar.mp3',
    'ك ل ب': 'assets/kalb.mp3',
    'ن و ر': 'assets/nuur.mp3',
    'ه ذ ا': 'assets/haida.mp3'
}

const LETTER_MAPPING = {
    'ā': 'ا',
    'b': 'ب',
    't': 'ت',
    'th': 'ث',
    'dj': 'ج',
    'ḥ': 'ح',
    'kh': 'خ',
    'd': 'د',
    'dh': 'ذ',
    'r': 'ر',
    'z': 'ز',
    's': 'س',
    'sh': 'ش',
    'ṣ': 'ص',
    'ḍ': 'ض',
    'ṭ': 'ط',
    'ẓ': 'ظ',
    'ʿ / ‘': 'ع',
    'gh': 'غ',
    'f': 'ف',
    'q': 'ق',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'h': 'ه',
    'ou': 'و',
    'i': 'ي',
}

const LEVEL1 = [
    ['recognition', ['ā', 'ou', 'i']],
    ['drawing', ['ā', 'ou', 'i']]
]

const LEVEL2 = [
    ['recognition', ['b', 't', 'th']],
    ['drawing', ['b', 't', 'th']],
    ['recognition', ['ā', 'ou', 'i', 'b', 't', 'th']],
    ['drawing', ['ā', 'ou', 'i', 'b', 't', 'th']]
]

const LEVEL3 = [
    ['recognition', ['dj', 'ḥ', 'kh']],
    ['drawing', ['dj', 'ḥ', 'kh']],
    ['recognition', ['ā', 'ou', 'i', 'b', 't', 'th', 'dj', 'ḥ', 'kh']],
    ['drawing', ['ā', 'ou', 'i', 'b', 't', 'th', 'dj', 'ḥ', 'kh']]
]

const LEVEL4 = [
    ['recognition', ['d', 'dh', 'r', 'z']],
    ['drawing', ['d', 'dh', 'r', 'z']],
    ['recognition', ['t', 'th', 'dj', 'ḥ', 'kh', 'd', 'dh', 'r', 'z']],
    ['drawing', ['t', 'th', 'dj', 'ḥ', 'kh', 'd', 'dh', 'r', 'z']]
]

const LEVEL5 = [
    ['recognition', ['s', 'sh', 'ṣ', 'ḍ']],
    ['drawing', ['s', 'sh', 'ṣ', 'ḍ']],
    ['recognition', ['d', 'dh', 'r', 'z', 's', 'sh', 'ṣ', 'ḍ']],
    ['drawing', ['d', 'dh', 'r', 'z', 's', 'sh', 'ṣ', 'ḍ']],
]

const LEVEL6 = [
    ['recognition', ['ṭ', 'ẓ', 'ʿ / ‘', 'gh']],
    ['drawing', ['ṭ', 'ẓ', 'ʿ / ‘', 'gh']],
    ['recognition', ['z', 's', 'sh', 'ṣ', 'ḍ', 'ṭ', 'ẓ', 'ʿ / ‘', 'gh']],
    ['drawing', ['z', 's', 'sh', 'ṣ', 'ḍ', 'ṭ', 'ẓ', 'ʿ / ‘', 'gh']],
]

const LEVEL7 = [
    ['recognition', ['f', 'q', 'k']],
    ['drawing', ['f', 'q', 'k']],
    ['recognition', ['ṭ', 'ẓ', 'ʿ / ‘', 'gh', 'f', 'q', 'k']],
    ['drawing', ['ṭ', 'ẓ', 'ʿ / ‘', 'gh', 'f', 'q', 'k']]
]

const LEVEL8 = [
    ['recognition', ['l', 'm', 'n', 'h']],
    ['drawing', ['l', 'm', 'n', 'h']],
    ['recognition', ['f', 'q', 'k', 'l', 'm', 'n', 'h']],
    ['drawing', ['f', 'q', 'k', 'l', 'm', 'n', 'h']],
]

// emphatiques et consoeurs
const LEVEL9 = [
    ['recognition', ['ṣ', 'ḍ', 'ṭ', 'ẓ']],
    ['drawing', ['ṣ', 'ḍ', 'ṭ', 'ẓ']],
    ['recognition', ['s', 'd', 't', 'z']],
    ['drawing', ['s', 'd', 't', 'z']],
    ['recognition', ['ṣ', 'ḍ', 'ṭ', 'ẓ', 's', 'd', 't', 'z']],
    ['drawing', ['ṣ', 'ḍ', 'ṭ', 'ẓ', 's', 'd', 't', 'z']],
]

const LEVELS = [LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9]

function randInt(N) {
    // returns integer between O and N-1
    return Math.floor(Math.random() * N);
}
/* Sketcher related stuff */
const DRAW_INTERACTIVE = {
    firstPointSize: 3,
    lineWidth: 3,
    strokeStyle: '#F0F',
    fillStyle: '#F0F',
    lineCap: 'round',
    lineJoin: 'round',
    miterLimit: 10
}

function centerStroke(stroke, offsetX, offsetY) {
    let centers_x = []
    let centers_y = []
    for (let curve in stroke) {
        var xmean = 0;
        var ymean = 0;
        for (let point in stroke[curve]) {
            xmean += stroke[curve][point][0];
            ymean += stroke[curve][point][1];
        }
        xmean /= stroke[curve].length;
        ymean /= stroke[curve].length;
        centers_x.push(xmean);
        centers_y.push(ymean);
    }
    var newStroke = []
    for (let curve in stroke) {
        var newCurve = []
        xmean = centers_x[curve] - offsetX;
        ymean = centers_y[curve] - offsetY;
        for (let point in stroke[curve]) {
            newCurve.push([stroke[curve][point][0] - xmean, stroke[curve][point][1] - ymean]);
        }
        newStroke.push(newCurve);
    }
    return newStroke;
}

var strokesCorrectAnswer = [
    [
        [181, 121],
        [184, 123],
        [185, 126],
        [187, 128],
        [189, 131],
        [192, 134],
        [195, 138],
        [197, 140],
        [199, 143],
        [201, 145],
        [203, 148],
        [205, 149],
        [206, 151],
        [208, 152],
        [209, 154],
        [210, 155],
        [211, 156],
        [213, 158],
        [214, 159],
        [215, 161],
        [216, 161],
        [217, 162],
        [217, 163],
        [218, 163],
        [218, 164],
        [219, 164],
        [219, 162],
        [221, 159],
        [223, 155],
        [225, 151],
        [227, 147],
        [229, 143],
        [230, 139],
        [232, 136],
        [234, 133],
        [236, 129],
        [237, 125],
        [239, 122],
        [243, 117],
        [246, 113],
        [249, 109],
        [252, 104],
        [255, 101],
        [258, 97],
        [260, 93],
        [263, 88],
        [267, 83],
        [270, 78],
        [271, 72],
        [273, 69],
        [275, 64],
        [276, 62],
        [276, 61],
        [277, 60],
        [277, 59],
        [277, 59],
        [277, 59]
    ],
];

var strokesIncorrectAnswer = [
    [
        [176, 62],
        [178, 62],
        [183, 64],
        [188, 69],
        [196, 75],
        [204, 81],
        [218, 92],
        [230, 100],
        [240, 107],
        [249, 113],
        [256, 118],
        [261, 122],
        [267, 128],
        [272, 133],
        [275, 137],
        [277, 141],
        [280, 145],
        [281, 146],
        [282, 148],
        [283, 148],
        [283, 149],
        [283, 149],
        [283, 149],
        [284, 150],
        [286, 151],
        [287, 152],
        [288, 152],
        [289, 153],
        [290, 153],
        [290, 154]
    ],
    [
        [172, 160],
        [172, 159],
        [172, 157],
        [174, 153],
        [177, 149],
        [183, 142],
        [188, 136],
        [192, 131],
        [197, 124],
        [201, 121],
        [205, 116],
        [208, 112],
        [212, 108],
        [216, 104],
        [219, 101],
        [223, 98],
        [227, 94],
        [233, 90],
        [235, 88],
        [240, 84],
        [243, 81],
        [250, 75],
        [256, 70],
        [261, 66],
        [264, 62],
        [269, 58],
        [274, 54],
        [277, 51],
        [280, 48],
        [282, 47],
        [283, 46],
        [283, 46],
        [284, 46]
    ]
]

// let's define a global sketch variable
var sketcher;


/* disable scrolling helper functions based on https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily */

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line getter-return
        get: function() { supportsPassive = true; }
    }));
    // eslint-disable-next-line no-empty
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


/**
 * Actual game logic starts here.
 */

function updateExerciseProgressBar(isFinished = false) {
    // updates progress bar
    var quizzData = document.getElementById('game-area').quizzData;
    var progressBar = document.getElementById('progress-bar');
    if (isFinished) {
        progressBar.innerHTML = 'Question : ' + (quizzData['correct'] + quizzData['incorrect']) + '/' + quizzData['total'] + ' | Correctes : ' + quizzData['correct'] + '/' + (quizzData['correct'] + quizzData['incorrect']);
    } else {
        progressBar.innerHTML = 'Question : ' + (quizzData['correct'] + quizzData['incorrect'] + 1) + '/' + quizzData['total'] + ' | Correctes : ' + quizzData['correct'] + '/' + (quizzData['correct'] + quizzData['incorrect']);
    }
}

function generateNewRecognitionQuestion() {
    // sets up a new question
    var taskLetters = document.getElementById('game-area').taskLetters

    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        var previousValue = document.getElementById('game-area').answer;
        var possibletaskLetters = taskLetters
            .filter(function(value) { return value != previousValue; });
        randomAnswer = possibletaskLetters[randInt(possibletaskLetters
            .length)];
        randomLetter = LETTER_MAPPING[randomAnswer];
    } else {
        // generate any new random letter the first time we start the game
        var randomAnswer = taskLetters[randInt(taskLetters
            .length)];
        var randomLetter = LETTER_MAPPING[randomAnswer];

    }
    // saving the new answer for later
    document.getElementById('game-area').answer = randomAnswer;

    // drawing the new letter on the canvas
    drawLetterOnCanvas(randomLetter);

    // update progress bar
    updateExerciseProgressBar();

}

function clearCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sketcher.handler(function(elem, data) {
        data.sketch.beginPath()
            .lineStyle('gray', 3)
            .line(0, 200, 500, 200)
            .stroke()
            .closePath()
    });

}

function drawLetterOnCanvas(randomLetter, clearBeforeDrawing = true) {
    if (clearBeforeDrawing) {
        clearCanvas();
    }
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "280px Amiri";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(randomLetter, canvas.width / 2., canvas.height / 2.);
}

function showRightWrongAnswer(caller) {
    if (document.getElementById('game-area').answer == caller.innerHTML) {
        document.getElementById('game-area').quizzData['correct'] += 1;
        sketcher.config({
            interactive: false,
            graphics: {
                lineWidth: 20,
                strokeStyle: 'green'
            },
        });
        sketcher.clear()
        sketcher.strokes(centerStroke(strokesCorrectAnswer,
                sketcher.elem.width / 2.,
                sketcher.elem.height / 2.))
            .animate.strokes()

        // add some button highlights
        caller.classList.toggle('right-answer');
        setTimeout(function() { caller.classList.toggle("right-answer"); }, 1500);
    } else {
        document.getElementById('game-area').quizzData['incorrect'] += 1;
        sketcher.config({
            interactive: false,
            graphics: {
                lineWidth: 20,
                strokeStyle: 'red'
            }
        });
        sketcher.clear()
        sketcher.strokes(centerStroke(strokesIncorrectAnswer,
                sketcher.elem.width / 2.,
                sketcher.elem.height / 2.))
            .animate.strokes()

        // add some highlights to buttons correct/incorrect
        caller.classList.toggle("wrong-answer");
        setTimeout(function() {
            caller.classList.toggle("wrong-answer");
        }, 1500);
        let buttons = document.getElementsByClassName('quizz-button');
        for (let button of buttons) {
            if (button.innerHTML == document.getElementById('game-area').answer) {
                button.classList.toggle('right-answer');
                setTimeout(function() {
                    button.classList.toggle("right-answer");
                }, 1500);
                break;
            }
        }
    }
}

function validateRecognitionAnswer(e) {
    var quizzData = document.getElementById('game-area').quizzData;
    var caller = e.target || e.srcElement;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total'] - 1) {
        // there are still questions left
        showRightWrongAnswer(caller);
        setTimeout(generateNewRecognitionQuestion, 1500);
    } else {
        // this exercise is now finished
        showRightWrongAnswer(caller);
        setTimeout(function() { finishExercise(quizzData) }, 1500);
    }
}

function finishExercise(quizzData) {
    /**  
     * The game is finished: display dialog and update main interface.
     * */
    var chapter, exercise, correct, incorrect;
    [correct, incorrect] = [quizzData['correct'], quizzData['incorrect']];
    [chapter, exercise] = document.getElementById('game-area').currentLevel;
    let starScore = updateStarRating(chapter, exercise, correct, incorrect);
    document.getElementById('myCanvas').style.display = "none";
    let infoBox = document.getElementById('canvas-data');
    infoBox.hidden = false;
    infoBox.innerHTML = `Bravo ! Vous venez de finir cet exercice. <br> Vous avez donné ${correct} bonne(s) réponse(s) et ${incorrect} mauvaise(s) réponse(s). <br> Votre score est de ${starScore}.`

    updateExerciseProgressBar(true);
    updateChapterProgress();
    saveProgress();
    // if it's a drawing exercise we also disable the bottom buttons
    document.getElementById('drawing-correct-answer').disabled = true;
    document.getElementById('drawing-incorrect-answer').disabled = true;
}

function toggleGameAreaModal() {
    var gameArea = document.getElementById('game-area');

    if (gameArea.className.indexOf('open') > -1) {
        // indexOf returns -1 when the string is not found
        gameArea.className = gameArea.className.replace('open', '');
        enableScroll();
        // deactivate interactive drawing when modal dialog is closed
        sketcher.config({ interactive: false });
        sketcher.clear();
    } else {
        // the else here means that the string was not found
        gameArea.className = gameArea.className + ' open';
        disableScroll();
    }
}

// eslint-disable-next-line no-unused-vars
function setupLevels() {
    /**
     * Parse level descriptions and insert nested level layout into HTML.
     */
    var root = document.getElementById('levels-container');
    for (let chapterIndex in LEVELS) {
        // create level heading
        var levelRoot = document.createElement('details');
        levelRoot.id = `details-chapter${chapterIndex}`;
        levelRoot.open = true;
        var levelSummary = document.createElement('summary');
        var levelHeader = document.createElement('em')
        levelHeader.innerHTML = 'Chapitre ' + (parseInt(chapterIndex) + 1);
        levelHeader.innerHTML += ` <span class="chapter-progress" id="chapter-progress-${chapterIndex}">0%</span>`
        levelSummary.appendChild(levelHeader)
        levelRoot.appendChild(levelSummary)

        // chapter description

        // level's new letters 
        var levelLetters = [];
        var transcribedLevelLetters = [];
        for (let letter of LEVELS[chapterIndex][0][1]) {
            levelLetters.push(LETTER_MAPPING[letter]);
            transcribedLevelLetters.push(letter);
        }

        // eslint-disable-next-line no-undef
        levelLetters = [...new Set(levelLetters)];
        // eslint-disable-next-line no-undef
        transcribedLevelLetters = [...new Set(transcribedLevelLetters)];

        var div = document.createElement('div');
        div.innerHTML = "Nouvelles lettres dans ce chapitre :";
        div.className = 'exercise'
        levelRoot.appendChild(div);
        var ul = document.createElement('ul');
        div.appendChild(ul)
        for (let letter in levelLetters) {
            let li = document.createElement('li');
            li.innerHTML = `<span class='arabic'>${levelLetters[letter]}</span>, transcrit par ${transcribedLevelLetters[letter]}, prononcé <audio controls> <source src="${LETTER_SOUNDS[transcribedLevelLetters[letter]]}" type="audio/mpeg">
          Your browser does not support the audio element.</audio>`
            ul.appendChild(li);
        }

        let validWords = [];
        for (let word in WORD_SOUNDS) {
            for (let letter of levelLetters) {
                if (word.indexOf(letter) != -1) {
                    validWords.push(word);
                    break;
                }
            }
        }
        div = document.createElement('div');
        div.innerHTML = "Mots du lexique s'écrivant avec les lettres introduites dans ce chapitre :";
        div.className = 'exercise'
        levelRoot.appendChild(div);
        ul = document.createElement('ul');
        div.appendChild(ul)
        for (let word of validWords) {
            let li = document.createElement('li');
            li.innerHTML = `<span class='arabic_smaller'>${word}</span>  <audio controls>
            <source src="${WORD_SOUNDS[word]}" type="audio/mpeg">
          Your browser does not support the audio element.
          </audio> `
            ul.appendChild(li);
        }

        // create level exercices
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let items = LEVELS[chapterIndex][exerciseIndex]
            let taskType = items[0];
            let taskLetters = items[1];
            if (taskType == 'recognition') {
                let div = document.createElement('div')
                levelRoot.appendChild(div)
                div.className = 'exercise'
                var header = document.createElement('h3')
                header.appendChild(document.createTextNode('Exercice ' + (parseInt(chapterIndex) + 1) + '.' + (parseInt(exerciseIndex) + 1) + ' : ' +
                    ' Reconnaître les lettres ' + taskLetters
                    .join(' - ')))

                div.append(header)
                var linkNode = document.createElement('button')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                    // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game ' + `start-chapter${chapterIndex}`
                div.appendChild(linkNode)

                var stars = document.createElement('div')
                stars.innerHTML = 'Score : ' + STAR_MAPPING[0]
                stars.id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`
                div.appendChild(stars)

            } else if (taskType == 'drawing') {
                div = document.createElement('div')
                levelRoot.appendChild(div)
                div.className = 'exercise'
                header = document.createElement('h3')
                header.appendChild(document.createTextNode('Exercice ' + (parseInt(chapterIndex) + 1) + '.' + (parseInt(exerciseIndex) + 1) + ' : ' +
                    ' Dessiner les lettres ' + taskLetters
                    .join(' - ')))

                div.append(header)
                linkNode = document.createElement('button')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                    // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game ' + `start-chapter${chapterIndex}`;
                div.appendChild(linkNode)

                stars = document.createElement('div')
                stars.innerHTML = 'Score : ' + STAR_MAPPING[0]
                stars.id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`
                div.appendChild(stars)
            } else {
                console.log('Could not recognize task type: ' + taskType);
            }

        }
        root.appendChild(levelRoot);

    }

    // assigning something to our sketchable
    // eslint-disable-next-line no-undef
    sketcher = new Sketchable(document.getElementById('myCanvas'));
    sketcher.config({ interactive: false });

    // disabling swipping / scrolling while drawing
    // https://stackoverflow.com/questions/49047414/disable-scroll-swipe-action-for-html-canvas-drawing-on-ios
    var canvas_dom = document.getElementById('myCanvas')
    canvas_dom.addEventListener("touchstart", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchmove", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchend", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchcancel", function(event) { event.preventDefault() })


    // update available chapters
    updateChapterProgress();

    // reload previously saved progress
    loadProgress();
}

function shuffleArray(inputArray) {
    /* Returns a shuffled copy of an array. 
    Adapted from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb */
    let array = [...inputArray]; // shallow copy of array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function runLevel(chapterIndex, exerciseIndex) {
    /**
     * Starts a new level defined by chapter and exercise index.
     */
    toggleGameAreaModal();
    document.getElementById('myCanvas').style.display = "block";
    document.getElementById('canvas-data').hidden = true;
    var exercise = LEVELS[chapterIndex][exerciseIndex]
    var taskType = exercise[0];
    var taskLetters = exercise[1];
    if (taskType == 'recognition') {
        document.getElementById('game-area').hidden = false;
        document.getElementById('game-area').currentLevel = [chapterIndex, exerciseIndex]
        document.getElementById('game-area').taskLetters = taskLetters
        var buttonArea = document.getElementById('button-area');
        // clearing old children
        while (buttonArea.firstChild) {
            buttonArea.removeChild(buttonArea.firstChild);
        }
        // shuffling taskletters
        var shuffledTaskLetters = shuffleArray(taskLetters);

        // adding a button for each letter in the current level
        for (let i = 0; i < taskLetters
            .length; i++) {
            let button = document.createElement('button');
            button.innerHTML = shuffledTaskLetters[i];
            button.className = 'quizz-button';
            buttonArea.appendChild(button);
            button.addEventListener("click", validateRecognitionAnswer);
        }
        // initializing quizz data
        document.getElementById('game-area').quizzData = { 'total': 32, 'correct': 0, 'incorrect': 0 };
        // generating a new quizz question
        generateNewRecognitionQuestion();

    } else if (taskType == 'drawing') {
        document.getElementById('game-area').hidden = false;
        document.getElementById('game-area').currentLevel = [chapterIndex, exerciseIndex]
        document.getElementById('game-area').taskLetters = taskLetters
        buttonArea = document.getElementById('button-area');
        // clearing old children
        while (buttonArea.firstChild) {
            buttonArea.removeChild(buttonArea.firstChild);
        }
        // creating buttons / text regions for drawing interactions 

        let p = document.createElement('p');
        p.id = 'drawing-text-area';
        buttonArea.appendChild(p);

        let button = document.createElement('button');
        button.innerHTML = 'Montrer';
        button.id = 'drawing-show-answer';
        button.className = 'quizz-button';
        button.addEventListener('click', showDrawingAnswer)
        buttonArea.appendChild(button);

        button = document.createElement('button');
        button.innerHTML = '&#10003;'
        button.id = 'drawing-correct-answer'
        button.className = 'quizz-button';
        button.disabled = true;
        button.addEventListener('click', validateDrawingAnswer);
        buttonArea.appendChild(button);

        button = document.createElement('button');
        button.innerHTML = '&#10005;';
        button.id = 'drawing-incorrect-answer'
        button.className = 'quizz-button';
        button.disabled = true;
        button.addEventListener('click', validateDrawingAnswer);
        buttonArea.appendChild(button);


        // initializing quizz data
        document.getElementById('game-area').quizzData = { 'total': 32, 'correct': 0, 'incorrect': 0 };
        // generating a new quizz question
        generateNewDrawingQuestion();
    }
}

function updateStarRating(chapterIndex, exerciseIndex, correct) {
    // updates the score rating
    let score;
    if (correct == 32) {
        score = 5
    } else if (correct >= 30) {
        score = 4
    } else if (correct >= 28) {
        score = 3
    } else if (correct >= 16) {
        score = 2
    } else if (correct >= 8) {
        score = 1
    } else {
        score = 0
    }
    let previousStars = document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML.split('Score : ')[1]
    let previousScore = REVERSE_STAR_MAPPING[previousStars]
    if (previousScore < score) {
        document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML = 'Score : ' + STAR_MAPPING[score]
    }
    return STAR_MAPPING[score];
}

function generateNewDrawingQuestion() {
    // generates a new question for a drawing task

    let taskLetters = document.getElementById('game-area').taskLetters
    let randomAnswer
    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        let previousValue = document.getElementById('game-area').answer;
        let possibletaskLetters = taskLetters
            .filter(function(value) { return value != previousValue; });
        randomAnswer = possibletaskLetters[randInt(possibletaskLetters
            .length)];

    } else {
        // generate any new random letter the first time we start the game
        randomAnswer = taskLetters[randInt(taskLetters
            .length)];


    }
    // saving the new answer for later
    document.getElementById('game-area').answer = randomAnswer;

    // writing new drawing question
    document.getElementById('drawing-text-area').innerHTML = 'La lettre à dessiner est : ' + randomAnswer;
    updateExerciseProgressBar();

    sketcher.config({
        interactive: true,
        graphics: DRAW_INTERACTIVE,
    });

    document.getElementById('drawing-show-answer').disabled = false;
    document.getElementById('drawing-correct-answer').disabled = true;
    document.getElementById('drawing-incorrect-answer').disabled = true;

    clearCanvas();

}

// eslint-disable-next-line no-unused-vars
function showDrawingAnswer(e) {
    // displays the expected letter on the canvas and allows the user to validate his answer

    drawLetterOnCanvas(LETTER_MAPPING[document.getElementById('game-area').answer], false);
    document.getElementById('drawing-correct-answer').disabled = false;
    document.getElementById('drawing-incorrect-answer').disabled = false;
    document.getElementById('drawing-show-answer').disabled = true;

}

function validateDrawingAnswer(e) {
    var caller = e.target || e.srcElement;
    if (caller.id == 'drawing-correct-answer') {
        document.getElementById('game-area').quizzData['correct'] += 1;
    } else {
        document.getElementById('game-area').quizzData['incorrect'] += 1;
    }
    let quizzData = document.getElementById('game-area').quizzData;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total']) {
        generateNewDrawingQuestion();
    } else {
        // the game is finished: display dialog and update main interface
        finishExercise(quizzData);
    }
}

// eslint-disable-next-line no-unused-vars
function updateChapterProgress() {
    /**
     * Updates the HTML headers of each chapters in percentage. Also unlocks the chapters as a function of progress.
     */
    var previousChapterCompleted = true;
    for (let chapterIndex in LEVELS) {
        // do the unlocking of chapters based on previous value
        for (let elem of document.getElementsByClassName(`start-chapter${chapterIndex}`)) {
            if (previousChapterCompleted) {
                elem.disabled = false;
            } else {
                elem.disabled = true;
            }
        }
        // close details of already finished chapters
        if (previousChapterCompleted && chapterIndex !== "0") {
            document.getElementById(`details-chapter${parseInt(chapterIndex) - 1}`).open = false;
        }


        let exercicesInChapter = LEVELS[chapterIndex].length;
        let aboveThreeStars = 0;
        let aboveFiveStars = 0;
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let previousStars = document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML.split('Score : ')[1];
            let currentScore = REVERSE_STAR_MAPPING[previousStars]
            if (currentScore >= 3) {
                aboveThreeStars += 1;
            }
            if (currentScore === 5) {
                aboveFiveStars += 1;
            }
        }
        // update chapter progress
        document.getElementById(`chapter-progress-${chapterIndex}`).innerHTML = `${Math.round(aboveThreeStars/ exercicesInChapter * 100)}%`;

        if (aboveFiveStars === exercicesInChapter) {
            document.getElementById(`chapter-progress-${chapterIndex}`).innerHTML += ' PERFECT';
        }
        // update the completion indicator for setting the next chapters
        if (aboveThreeStars === exercicesInChapter) {
            previousChapterCompleted = true;
        } else {
            previousChapterCompleted = false;
        }
    }
}

function loadProgress() {
    /**
     * Reloads previous progress data if it exists.
     */
    if (localStorage.getItem('progress') !== null) {
        console.log('Found existing storage data.');
        console.log(localStorage.progress);
        let split = localStorage.progress.split(',');
        if (split.length > 1) {
            let ids = [];
            let scores = [];
            for (let i in split) {
                if (i % 2 === 0) {
                    ids.push(split[i]);
                } else {
                    scores.push(split[i]);
                }
            }
            for (let i in ids) {
                document.getElementById(ids[i]).innerHTML = scores[i];
            }
        }
    }
    updateChapterProgress();
}

function saveProgress() {
    /**
     * Saves progress data to browser local storage.
     */
    let savedValues = [];
    for (let chapterIndex in LEVELS) {
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`;
            let currentScore = document.getElementById(id).innerHTML;
            savedValues.push([
                [id, currentScore]
            ]);
        }

    }
    localStorage.progress = savedValues;
}

// eslint-disable-next-line no-unused-vars
function clearProgressAndReset() {
    /**
     * Erases locally saved progress and reset all chapter progress to zero. 
     */
    localStorage.progress = null;
    for (let chapterIndex in LEVELS) {
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`;
            document.getElementById(id).innerHTML = `Score : ${STAR_MAPPING[0]}`;
        }
    }
    updateChapterProgress();
    document.getElementById('details-chapter0').open = true;
}

// eslint-disable-next-line no-unused-vars
function unlockAllLevels() {
    // cheat code for testing purposes only :)
    for (let chapterIndex in LEVELS) {
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            updateStarRating(chapterIndex, exerciseIndex, 32);
        }
    }
    updateChapterProgress();
}
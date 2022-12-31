var arrowCodes = {
    37: 'left',
    38: 'up',
    39: 'right'
};

function trackKeys(codes) {
    var pressed = Object.create(null);

    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type === 'keydown';

            pressed[codes[event.keyCode]] = down;

            event.preventDefault();
        }
    }

    addEventListener('keydown', handler, false);
    addEventListener('keyup', handler, false);

    return pressed;
}

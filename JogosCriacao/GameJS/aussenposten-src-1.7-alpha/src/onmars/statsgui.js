var colors = {
    production: {
        stone: 'grey',
        nutrition: 'green',
        ore: 'orange',
        money: 'red'
    },
    storage: {
        stone: 'darkgrey',
        nutrition: 'darkgreen',
        ore: 'darkorange',
        money: 'darkred'
    },
    population: {
        count: 'blue',
        happiness: 'darkblue',
        fullness: 'lightblue'
    },
    buildings: {
        count: 'black',
        damage: 'lightred'
    }
}

var StatsGui = exports.StatsGui = function(domeGui) {
    this.domeGui = domeGui;
    var $stats = document.getElementById('stats-container');
    var $statsCanvas = $('#stats-canvas');

    this.visible = {};
    Object.keys(colors).forEach(function(major) {
        this.visible[major] = {};
        Object.keys(colors[major]).forEach(function(minor) {
            this.visible[major][minor] = (major === 'storage' && (minor === 'stone' || minor == 'nutrition')) ||
                ((major == 'population') && (minor == 'count' || minor == 'fullness'))
        }, this);
    }, this);

    this.render = function() {
        if (!this.domeGui.dome) {
            return;
        }
        //clean
        var $svg = $stats.getElementsByTagName('svg')[0];
        if ($svg) {
            document.getElementById('stats-canvas').removeChild($svg);
        }

        var firstRender = true;
        Object.keys(colors).forEach(function(major, i) {
            Object.keys(colors[major]).forEach(function(minor, j) {
                this.$checkboxes[major][minor].checked = true;
                if (this.visible[major][minor] == false) {
                    this.$checkboxes[major][minor].checked ="";
                    return;
                }
                var cn = null;
                var args = [];
                args.push(this.domeGui.dome.stats[major][minor]);
                if (firstRender) {
                    cn = $statsCanvas.simplegraph;
                    //labels
                    args.push([]);
                    firstRender = false;
                } else {
                    cn = $statsCanvas.simplegraph_more;
                }
                args.push({
                    penColor: colors[major][minor],
                    yAxisCaption: major + ' - ' + minor,
                    lowerBound: 0,
                    minYAxisValue: 1,
                    leftGutter: 8*30,
                    width: 1027,
                    height: 600,
                    addHover: false,
                    gridBorderColor: '#white',
                    //drawPoints: true
                });
                cn.apply($statsCanvas, args);
            }, this);
        }, this);
    }

    this.onClick = function(ev) {
        var $target = ev.currentTarget;
        var major = $target.dataset.major || $target.parentNode.dataset.major;
        var minor = $target.parentNode.dataset.minor || $target.dataset.minor;
        this.visible[major][minor] = !this.visible[major][minor];

        this.render();
    }

    var self = this;
    this.$checkboxes = {};
    var $fieldsets = $stats.getElementsByTagName('fieldset');
    for (var i = 0; i < $fieldsets.length; i++) {
        $fieldset = $fieldsets[i];
        var $inputs = $fieldset.getElementsByTagName('input');
        for (var j = 0; j < $inputs.length; j++) {
            var $input = $inputs[j];
            var major = $input.dataset.major || $fieldset.dataset.major;
            var minor = $fieldset.dataset.minor || $input.dataset.minor;
            this.$checkboxes[major] = (this.$checkboxes[major] || {});
            this.$checkboxes[major][minor] = $input;
            $input.parentNode.getElementsByTagName('label')[j].style.backgroundColor = colors[major][minor];
            $input.addEventListener('change', function(ev) {
                self.onClick(ev);
            });
        }
    };

    self.active = false;

    document.getElementById('stats-close').addEventListener('click', function() {
        self.active = false;
        $stats.style.display = "none";
    });

    document.getElementById('stats-open').addEventListener('click', function() {
        self.active = true;
        $stats.style.display = "block";
        self.render();
    })


    return this;
}
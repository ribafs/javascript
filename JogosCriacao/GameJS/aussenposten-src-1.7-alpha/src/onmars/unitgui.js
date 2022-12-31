var gamejs = require('gamejs');
var $v = require('gamejs/math/vectors');
var Building = require('./building').Building;

exports.UnitGui = function(planetView) {

    var planet = planetView.planet;

    var selectedUnitView = null;
    this.onMouseUp = function(event) {
        var didFind = planetView.domeViews.some(function(dv) {
            return dv.unitViews.some(function(uv) {
                var topleft = $v.subtract(uv.unit.pixelPosition, planetView.viewRect.topleft);
                if ($v.distance(topleft, event.pos) < 20) {
                    selectedUnitView = uv;
                    console.dir(uv.unit);
                    return true;
                }
            });
        });
        if (didFind == false) {
            selectedUnitView = null;
            $('unit-info-container').classList.remove('visible');
        } else {
            updateDiv()
            if ($('unit-info-container').classList.contains('visible')) {
                $('unit-info-container').classList.remove('visible');
            }
            setTimeout(function() {
                $('unit-info-container').classList.add('visible');
            }, 100)

        }
    }

    var $ = function(id) {
        return document.getElementById(id);
    }

    // manual two way binding.this really needs a template...
    var updateDiv = function(){
        if (selectedUnitView == null) {
            return;
        }
        var unit = selectedUnitView.unit;


        var unitName = unit.unitType === 'helot' ? 'Helot' : 'Mighty';
        unitName += ' ' + unit.name;
        $('unit-info-portrait').src = selectedUnitView.walkAnimation.getPortrait().scale([64, 40])._canvas.toDataURL();
        $('unit-carrying-info').style.display = 'none';
        var timeRemaining = (unit.dayState.resolveTimeRemaining / 1000).toFixed(0);

        $('happiness-unit-desc').innerHTML = (100 * unit.happiness).toFixed(0) + "%";
        $('happiness-unit-progress').value = unit.happiness;
        $('fullness-unit-desc').innerHTML = (100 * unit.fullness).toFixed(0) + "%";
        $('fullness-unit-progress').value = unit.fullness;

        if (unit.jobState && unit.jobState.output) {
            $('carrying-info-amount').innerHTML = (unit.jobState.output.amount).toFixed(0);
            $('carrying-info-resource').innerHTML = Building.resourceToDisplay[unit.jobState.output.resource];
            $('unit-carrying-info').style.display = 'block'
        }

        var todo = "";
        if (unit.dayState.routeFinished === false && unit.dayState.building) {
            if (unit.dayState.type === 'eat') {
                todo = 'Heading to the ' + unit.dayState.building.typeInfo.display + ' to eat something'
            } else if (unit.dayState.type === 'work' && unit.dayState.building) {
                todo = "Going to work at " + unit.dayState.building.typeInfo.display;
            } else if (unit.dayState.type === 'relax') {
                todo = "Going home to relax.";
            } else if (unit.dayState.type === 'oppulence' && unit.dayState.building) {
                todo = "Going to " + unit.dayState.building.typeInfo.display;
            } else if (unit.dayState.type === 'idle') {
                todo = 'Idle';
                timeRemaining = "";
            } else if (unit.dayState.type === 'gounderground') {
                todo = 'Going back underground';
                timeRemaining = "";
            }
        } else {
            if (unit.dayState.type === 'eat') {
                todo = 'Eating';
            } else if (unit.dayState.type === 'relax') {
                todo = 'Relaxing';
            } else if (unit.dayState.type === 'oppulence') {
                todo = 'Enjoying the high arts';
            } else if (unit.dayState.type === 'work') {
                if (unit.jobState === null && unit.dayState.building) {
                    todo = 'Working at ' + unit.dayState.building.typeInfo.display ;
                    if (['authority', 'maintenance'].indexOf(unit.dayState.building.type) > -1) {
                        todo += ' Waiting for assignment'
                    }
                } else if (unit.jobState && unit.jobState.routeFinished === false) {
                    if (unit.jobState.type === 'repair') {
                        todo = 'Going to repair damaged ' + unit.jobState.building.typeInfo.display;
                    } else if (unit.jobState.type === 'fetch') {
                        var getResource = unit.jobState.storageType
                         || unit.jobState.building.extraTypeInfo.importResource
                         || unit.jobState.building.typeInfo.output.resource;
                        todo = 'Going to ' + unit.jobState.building.typeInfo.display + ' to get ' + getResource;
                    } else if (unit.jobState.type === 'store') {
                        todo = 'Bringing resources back to ' + unit.dayState.building.typeInfo.display;
                    } else if (unit.jobState.type === 'incident') {
                        todo = 'Going to apply authority at ' + unit.jobState.building.typeInfo.display;
                    } else if (unit.jobState.type === 'gohomemaintenance') {
                        todo = "Returning maintenance equipment";
                    } else if (unit.jobState.type === 'gohomeauthority') {
                        todo = "Returning authority equipment";
                    }
                } else if (unit.jobState && unit.jobState.routeFinished === true) {
                    if (unit.jobState.type === 'repair') {
                        todo = 'Repairing ' + unit.jobState.building.typeInfo.display;
                    } else if (unit.jobState.type === 'fetch') {
                        todo = 'Picking up resources from ' + unit.jobState.building.typeInfo.display;
                    } else if (unit.jobState.type === 'store') {
                        todo = 'Storing resources';
                    } else if (unit.jobState.type === 'incident') {
                        todo = 'Applying authority at ' + unit.jobState.building.typeInfo.display;
                    }
                }
            }
        }

        if (unit.dayState && unit.dayState.routeFinished && unit.dayState.building.type == 'maintenance') {
            unitName = "Repairbot (" + unitName + ')';
        } else if (unit.dayState && unit.dayState.routeFinished && unit.dayState.building.type === 'storage') {
            unitName = "Carrierbot (" + unitName +')';
        } else if (unit.dayState && unit.dayState.routeFinished && unit.dayState.building.type === 'authority') {
            unitName = "Authoritybot (" + unitName +')';
        }

        $('unit-info-timeleft').innerHTML = timeRemaining;
        $('unit-info-title').innerHTML = unitName;
        $('unit-info-todo').innerHTML = todo;
    }


    var maxTimeout = 500;
    var timeout = maxTimeout;
    this.update = function(msDuration) {
        timeout -= msDuration;
        if (timeout <= 0) {
            timeout = maxTimeout;
            updateDiv();
        }
    }

    this.draw = function(display) {
        if (selectedUnitView == null) {
            return;
        }
        var unit = selectedUnitView.unit;
        var topleft = $v.subtract(unit.pixelPosition, planetView.viewRect.topleft);
        gamejs.graphics.circle(display, '#ffff66', topleft, 18, 2);

        var path = unit.dayState && unit.dayState.route;
        if (path == null || path.length <= 0) {
            path = unit.jobState && unit.jobState.route;
        }
        if (path != null) {
            // @@ this is TILESIZE/2
            var tf = $v.add(planetView.viewRect.topleft, [-8,-8]);
            path = path.map(function(p) {
                return $v.subtract(p, tf);
            })
            gamejs.graphics.lines(display, '#ffff66', false, path, 2);
        }
    }

    var cancelProp = function(event) {
        if (selectedUnitView) {
            event.stopPropagation();
        }
    }


    $('unit-info').addEventListener('mouseup', cancelProp, false)
    $('unit-info').addEventListener('mousedown', cancelProp, false)

    return this;
}
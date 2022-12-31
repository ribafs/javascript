var gamejs = require('gamejs');
var $v = require('gamejs/math/vectors');
var Building = require('./building').Building;

exports.BuildingGui = function(planetView) {

    var planet = planetView.planet;

    var selectedBuildingView = null;
    this.onMouseUp = function(event) {
        var didFind = planetView.domeViews.some(function(dv) {
            return dv.buildingViews.some(function(bv) {
                var topleft = $v.subtract(bv.building.pixelPosition, planetView.viewRect.topleft);
                var rect = new gamejs.Rect(topleft, bv.widthHeight);
                if (rect.collidePoint(event.pos)) {
                    selectedBuildingView = bv;
                    return true;
                }
            });
        });
        if (didFind == false) {
            selectedBuildingView = null;
            $('building-info').classList.remove('visible');
        } else {
            updateDiv()
            updateDiv()
            if ($('building-info').classList.contains('visible')) {
                $('building-info').classList.remove('visible');
            }
            setTimeout(function() {
                $('building-info').classList.add('visible');
            }, 100)

        }
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

    var $ = function(id) {
        return document.getElementById(id);
    }

    // manual two way binding
    var updateDiv = function(){
        if (selectedBuildingView == null) {
            return;
        }

        $('storage-full').style.display = 'none';
        $('missing-input-resource').style.display = 'none';
        $('updatefactor-container').style.display = 'none';
        $('has-incident').style.display = 'none';
        $('worker-container').style.display = 'none'
        $('workers-range').disabled = false;
        $('electricity-container').style.display = 'none';
        $('productivity-container').style.display = 'none';
        $('storage-container').style.display = 'none';
        // ! block
        $('status-container').style.display = 'block';
        $('building-info-storage').style.display = 'none';
        $('importexport-container').style.display = 'none';
        $('normal-storage-full').style.display = 'none';

        var building =selectedBuildingView.building;

        $('building-info-destroy').style.display = 'block';
        if (building.type === 'elevator') {
            $('building-info-destroy').style.display = 'none';
        }

        $('building-info-title').innerHTML = building.typeInfo.display;

        $('building-info-desc').innerHTML = $(building.type + '-info').getElementsByClassName('description')[0].innerHTML;


        $('damage-building-desc').innerHTML = (building.damage * 100).toFixed(0) + "%";
        $('damage-building-progress').value = building.damage;
        if (building.typeInfo.energyNeed < 0) {
            $('status-container').style.display = 'none';
        }

        if( building.type === 'teleport') {
            var $importExport = document.getElementsByClassName('importexport-select');
            for (var i = 0; i < $importExport.length; i++) {
                var $i = $importExport[i];
                $i.value = building.extraTypeInfo[$i.dataset.type + 'Resource'] || "";
            }
            $('importexport-container').style.display = 'block';

        }

        if (['storage', 'elevator', 'teleport'].indexOf(building.type) > -1) {
            $('building-info-storage').style.display = 'block';
            var sList = $('building-info-storage-list');
            sList.innerHTML = "";
            Object.keys(building.storage).forEach(function(resType) {
                var count = (building.storage[resType]).toFixed(0);
                if (count === '0') {
                    return;
                }
                sList.innerHTML += '<li>' + Building.resourceToDisplay[resType] + ': ' + count + '</li>';
            });
        }

        if (building.typeInfo.maxWorkers) {
            var workerText = building.userMaxWorkers + '/' + building.typeInfo.maxWorkers;
            $('workers-display').innerHTML = workerText;
            $('workers-range').max = building.typeInfo.maxWorkers;
            $('workers-range').value = building.userMaxWorkers;
            $('worker-container').style.display = 'block'
            if (['living', 'quarter'].indexOf(building.type) > -1) {
                $('workers-range').disabled = true;
            }
        }
        if (building.typeInfo.energyNeed > 0) {
            $('electricity-container').style.display = 'block';
        }
        $('electricity-switch').checked = building.hasEnergy;

        var prod = building.getProductivity();
        if (false == isNaN(prod) && prod > -1) {
            $('productivity-building-progress').value = prod
            $('productivity-building-desc').innerHTML = (prod * 100).toFixed(0) + "%";
            $('productivity-container').style.display = 'block';
        }
        if (building.typeInfo.output) {
            $('storage-building-desc').innerHTML = (building.outputStorage).toFixed(0) + '/' + building.typeInfo.output.max
            $('storage-building-progress').max = building.typeInfo.output.max;
            $('storage-building-progress').value = building.outputStorage;
            $('storage-container').style.display = 'block';

            if (building.outputStorage >= building.typeInfo.output.max) {
                $('storage-full').style.display = 'block';
            }
        }
        if (building.isStorageFull()) {
            $('normal-storage-full').style.display = 'block';
        }

        if (building.typeInfo.input) {
            var hasResource = building.dome.testForResource(building.typeInfo.input.resource, 1) > 0;
            if (false === hasResource) {
                $('missing-input-resource').style.display = 'block';
            }
        }
        if (building.incident !== null) {
            $('has-incident').style.display = 'block';
        }

        var updateFactor = building.untilUpdateFactor();
        if ( (building.typeInfo.output || building.type === 'teleport') && updateFactor >= 0) {
            $('building-info-updatefactor').value = 1-updateFactor;
            $('updatefactor-container').style.display = 'block';
        }
    }


    this.draw = function(display) {
        if (selectedBuildingView == null) {
            return;
        }
        var rect = new gamejs.Rect(
                    $v.subtract(selectedBuildingView.building.pixelPosition, planetView.viewRect.topleft),
                    selectedBuildingView.widthHeight
                );
        gamejs.graphics.rect(display, '#ffff66', rect, 2);
    }

    var cancelProp = function(event) {
        if (selectedBuildingView) {
            event.stopPropagation();
        }
    };

    var selectImportExport = function(event) {
        var t = event.currentTarget;
        var building = selectedBuildingView.building;
        if (t.selectedOptions.length > 0) {
            var res = t.selectedOptions[0].value;
            building.extraTypeInfo[t.dataset.type + 'Resource'] = res;
        }
    }

    var onDestroy = function(event) {
        if (selectedBuildingView == null) {
            return;
        }
        var building = selectedBuildingView.building;
        var pos = building.pixelPosition;
        // @@ sounds.play('destroyed');
        spawnPopup(building.typeInfo.display + ' destroyed', pos, false);
        var elevator = building.dome.getBuildings('elevator')[0];
        elevator.storage.stone += building.typeInfo.stone /2;
        elevator.storage.money += building.typeInfo.cost /2;

        building.damage = 1;
        selectedBuildingView.building.dome.unplace(selectedBuildingView.building);
        selectedBuildingView = null;
    }

    $('workers-range').addEventListener('change', function(event) {
        var t = event.currentTarget;
        selectedBuildingView.building.userMaxWorkers = parseInt(t.value, 10);
        updateDiv();
    }, false);

    var $importExport = document.getElementsByClassName('importexport-select');
    for (var i = 0; i < $importExport.length; i++) {
        var $i = $importExport[i];
        $i.addEventListener('click', selectImportExport, false);

    }

    $('building-info').addEventListener('mouseup', cancelProp, false)
    $('building-info').addEventListener('mousedown', cancelProp, false)
    $('building-info-destroy').addEventListener('mouseup', onDestroy, false);
    return this;
}
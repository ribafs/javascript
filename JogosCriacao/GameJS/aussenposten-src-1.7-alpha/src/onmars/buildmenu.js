var Building = require('./building').Building;
var TYPES = Building.TYPES;
var TILESIZE = require('./views').TILESIZE;
var $v = require('gamejs/math/vectors');
var gamejs = require('gamejs');
var tileToPixel = require('./views').tileToPixel;
var pixelToTile = require('./views').pixelToTile;
var sounds = require('./sounds');
var Dome = require('./dome').Dome;

var buildFont = new gamejs.font.Font("15px 'Hammersmith One', monospace");


exports.BuildMenu = function(planetView) {
    var planet = planetView.planet;


    this.verifyPlaceable = function() {
        if (null == this.type || this.dome == null) {
            return;
        }

        var tilePos = this.tilePos = $v.multiply(
            planetView.pixelToTile($v.add(this.rect.topleft, planetView.viewRect.topleft)),
            planetView.zoomFactor()
        );
        if (tilePos[0] < 0 || tilePos[1] < 0) {
            // short circuit if outside of planetview
            this.placeable = false;
            this.superBuilding = null;
            return
        }

        this.notEnoughResources = false;

        if (this.dome.testForResource('stone', this.type.stone) < this.type.stone) {
            this.notEnoughResources = true;
            this.placeable = false;
            this.superBuilding = null;
            return;
        }
        if (this.dome.testForResource('money', this.type.cost) < this.type.cost) {
            this.notEnoughResources = true;
            this.placeable = false;
            this.superBuilding = null;
            return;
        }

        var hasRightProperty = true;
        var w = this.type.width + 2;
        var h = this.type.height + 1;
        var startI = -1;
        var startJ = -1;
        var shouldBeOutside = false;
        // need to check fence/dome area too
        if (this.typeName == 'elevator') {
            shouldBeOutside = true;
            w = 80;
            h = 80;
            startI = -40;
            startJ = -40;
        }
        for (var i = startI; i < w; i++) {
            for (var j = startJ; j < h; j++) {
                var cTilePos = [
                    tilePos[0] + i,
                    tilePos[1] + j
                ];
                if (shouldBeOutside) {
                    if (this.dome.isInside(cTilePos)) {
                        hasRightProperty = false;
                        break;
                    }
                    if (i >= 0 && i < this.type.width && j >= 0 && j < this.type.height) {
                        if (false == planet.isWalkable(cTilePos)) {
                            hasRightProperty = false;
                            break;
                        }
                    }
                } else {
                    if (this.dome.isInside(cTilePos) == false) {
                        hasRightProperty = false;
                        break;
                    }
                    if (this.type.planetProperty) {
                        if (false == planet.hasTileProperty(cTilePos, this.type.planetProperty)) {
                            hasRightProperty = false;
                            break;
                        }
                    }
                    if (i !== 0) {
                        if (false == this.dome.isWalkable(cTilePos)) {
                            hasRightProperty = false;
                            break;
                        }
                    } else {
                        if (false == this.dome.planet.isWalkable(cTilePos)) {
                            hasRightProperty = false;
                            break;
                        }
                    }
                }
            }
            // outside loop
            if (hasRightProperty == false) {
                break;
            }
        }
        if (this.type.isWorkerBuilding === true) {
            this.superBuilding = this.dome.getClosestSuperBuilding(tilePos, this.typeName);
            this.placeable = hasRightProperty && this.superBuilding !== undefined;
        } else {
            this.superBuilding = null;
            this.placeable = hasRightProperty;
        }

    }

    var deactAll = function() {
        for (var i = 0; i < buildings.length; i++) {
            buildings[i].classList.remove('active');
        }
        self.type = null;
        self.rect = null;
        self.rotation = 0;
        document.body.style.cursor = "auto";
    }

    var self = this;
    self.rect = null;
    this.typeName = null;
    self.type = null;
    self.placeable = false;
    self.superBuilding = null;
    this.rotation = 0;

    this.draw = function(display) {
        if (null == this.rect) {
            return;
        }
        var color = 'rgba(0, 255, 0, 0.5)';
        if (this.notEnoughResources || this.placeable == false) {
            color = 'rgba(255, 0, 0, 0.5)';
        }
        var zoomedWidthHeight = $v.divide([this.rect.width, this.rect.height], planetView.zoomFactor());
        gamejs.graphics.rect(display, color, new gamejs.Rect(this.rect.topleft, zoomedWidthHeight), 0);
        var entrance;
        var zoomedTilesize = TILESIZE / planetView.zoomFactor();
        // somewhat duplicated in building constructor
        if (this.rotation === 0) {
            entrance = $v.add(this.rect.topleft, [
                1 * zoomedTilesize,
                (this.type.height -1) * zoomedTilesize
            ]);
        } else if (this.rotation === 1) {
            entrance = $v.add(this.rect.topleft, [
                0,
                1 * zoomedTilesize
            ]);
        } else if (this.rotation === 2) {
            entrance = $v.add(this.rect.topleft, [
                (this.type.width - 2) * zoomedTilesize,
                0
            ]);
        } else if (this.rotation === 3) {
            entrance = $v.add(this.rect.topleft, [
                (this.type.height -1) * zoomedTilesize,
                (this.type.width - 2) * zoomedTilesize
            ])
        }
        gamejs.graphics.rect(display, 'white', new gamejs.Rect(entrance, [zoomedTilesize, zoomedTilesize]), 0);
        if (this.notEnoughResources) {
            display.blit(this.notEnoughMoneySurface, $v.subtract(this.rect.topleft, [0, 30]));
        }
        if (this.type.perWorkerBuilding !== undefined) {
            gamejs.graphics.circle(display, color, this.rect.center, this.type.perWorkerBuildingMaxRadius * zoomedTilesize, 2);
        }
        if (this.superBuilding != null) {
            var widthHeight = $v.multiply(
                tileToPixel([this.superBuilding.width, this.superBuilding.height]),
                planetView.zoomFactor()
            );
            var px = $v.subtract(this.superBuilding.pixelPosition, planetView.viewRect.topleft);
            var rect = new gamejs.Rect(px, widthHeight);
            gamejs.graphics.circle(display, color, rect.center, this.superBuilding.typeInfo.perWorkerBuildingMaxRadius * zoomedTilesize, 1);
        }
        if (this.typeName === 'elevator') {
            // draw fence
            var wh = 80 * zoomedTilesize;
            var rect = new gamejs.Rect($v.subtract(this.rect.topleft, [wh/2, wh/2]), [wh, wh]);
            gamejs.graphics.rect(display, 'blue', rect, 5);
        }

    }

    var toggleClick = function(event) {
        var entry = event.currentTarget;
        var wasActive = entry.classList.contains('active');
        planetView.zoomIn();
        deactAll();
        if (false == wasActive) {
            sounds.play('gui-click');
            entry.classList.add('active');
            self.typeName = entry.dataset.id;
            self.type = TYPES[self.typeName];
            self.rect = new gamejs.Rect([0, 0], [self.type.width * TILESIZE, self.type.height * TILESIZE]);
            document.body.style.cursor = "none";
            if (self.typeName === 'elevator') {
                planetView.zoomOut();
            }
        }
    }

    var hideAllInfo = function() {
        var info = document.getElementsByClassName('building-details');
        for (var i = 0; i < info.length; i++) {
            info[i].style.display = 'none';
        }
    }

    var onEnter = function(event) {
        hideAllInfo();
        var entry = event.target;
        var infoId = entry.dataset.id + '-info';
        var info = document.getElementById(infoId);
        info.style.display = 'block';

        info.style.position = 'absolute';
        info.style.top = (window.innerHeight - entry.clientHeight - 300) + 'px';
        info.style.left = entry.offsetLeft + 125 + 'px';
    }
    var onLeave = function(event) {
        hideAllInfo();
    }

    this.updateDisabled = function() {
        var centerTilePos = $v.multiply(
            planetView.pixelToTile($v.add(planetView.viewRect.topleft, $v.divide(gamejs.display.getSurface().getSize(), 2))),
            planetView.zoomFactor()
        );
        this.dome = planet.getClosestDome(centerTilePos);
        var $buildings = document.getElementById('buildmenu').getElementsByClassName('building');
        for (var i = 0; i<$buildings.length;i++) {
            var $building = $buildings[i];
            var bType = $building.dataset.id;
            var req = Building.PRECONDITIONS[bType];
            $building.dataset.menuDisabled = "yes";
            if (this.dome &&
                (req == null || this.dome.getBuildings(req).length > 0)) {
                    $building.dataset.menuDisabled = "no";
                    tabClick();
            }
        }
    }

    var updateTimeout = 1000;
    var lastUpdateCheck = 0;
    this.update = function(msDuration) {
        if (Date.now() - lastUpdateCheck > updateTimeout) {
            lastUpdateCheck = Date.now();
            self.updateDisabled();
        }
    }

    var timeout = 50;
    var lastCheck = 0;
    this.onMouseMove = function(event) {
        if (self.rect) {
            self.rect.topleft = tileToPixel(pixelToTile(event.pos));
        }
        if (Date.now() - lastCheck > timeout) {
            lastCheck = Date.now();
            self.verifyPlaceable();
        }
    }

    this.onMouseUp = function(event) {
        // undo selection if rightclick
        if (event.button === 2) {
            deactAll();
            planetView.zoomIn();
            return;
        }
        if (null == this.type || this.placeable == false || this.notEnoughResources) {
            return;
        }
        // do nothing outside of canvas
        if (event.pos[0] < 0 || event.pos[1] < 0) {
            return;
        }

        var pos = $v.add(event.pos, planetView.viewRect.topleft);
        var buildParams = {
            dome: this.dome,
            type: this.typeName,
            topleft: this.tilePos,
            rotation: this.rotation
        }
        sounds.play('construction');
        spawnPopup(this.type.display + ' deployed', pos, false);
        this.dome.getResource('stone', this.type.stone);
        this.dome.getResource('money', this.type.cost);

        if (this.typeName === 'elevator') {
            // place dome
            var fenceTopLeft = $v.subtract(this.tilePos, [40,40]);
            var dome = new Dome({topleft: fenceTopLeft, width: 80, planet: planet});
            planetView.emit(dome);
            planet.domes.push(dome);
            this.dome = dome;

            // center
            planetView.zoomIn();
            planetView.viewRect.topleft = tileToPixel(fenceTopLeft);
        }
        if (this.superBuilding !== undefined) {
            this.dome.place(new Building(buildParams), this.superBuilding);
        } else {
            this.dome.place(new Building(buildParams));
        }

        deactAll();
        // click same tab again after fixing building stats
        this.updateDisabled();
        tabClick();

    }

    this.onKeyUp = function(event) {
        if (!this.rect) {
            return;
        }
        if (event.key === gamejs.event.K_r) {
            this.rotation +=1;
            if (this.rotation > 3) {
                this.rotation = 0;
            }
            var oCenter = this.rect.center.slice(0);
            this.rect = new gamejs.Rect([0, 0], [this.rect.height, this.rect.width]);
            this.rect.center = oCenter;
        }
    };

    var lastTab = null;
    var tabClick = function(event) {
        var $target = lastTab = event && event.currentTarget || lastTab;

        if (event && !event.initialFake) {
            deactAll();
            sounds.play('gui-click');
        }

        var tabEntries = document.getElementsByClassName('tab-entry');
        for (var i = 0; i < tabEntries.length; i++) {
            if (tabEntries[i].dataset.type !== $target.dataset.type) {
                tabEntries[i].classList.remove('tab-highlight');
            } else {
                tabEntries[i].classList.add('tab-highlight');
            }
        }

        var typeList = Building.TABS[$target.dataset.type];
        var buildings = $buildMenu.getElementsByClassName('building');
        for (var i = 0; i < buildings.length; i++) {
            var type = buildings[i].dataset.id;
            var $building = buildings[i];
            if (typeList.indexOf(type) == -1 || $building.dataset.menuDisabled == "yes") {
                $building.classList.add('disabled');
            } else if ( $building.dataset.menuDisabled == "no" || (event && event.initialFake && type === 'oxygen')) {
                $building.classList.remove('disabled');
            }
        }
    }

    // constructor
    var $buildMenu = document.getElementById('buildmenu');

    var tmplDetails = document.getElementById('tmpl-building-details').textContent;
    var tmplInfo = document.getElementById('tmpl-building-info').textContent;

    // insert money into divs
    var parser = new DOMParser();
    Object.keys(TYPES).forEach(function(typeId) {
        // @@ meh
        var ctx = JSON.parse(JSON.stringify(TYPES[typeId]));
        ctx.type = typeId;
        var rendered = Mustache.render(tmplDetails, ctx);
        var doc = parser.parseFromString(rendered, "text/html");
        document.body.appendChild(doc.body.firstChild);

        var infoRendered= Mustache.render(tmplInfo, ctx);
        var infoDoc = parser.parseFromString(infoRendered, "text/html");
        $buildMenu.appendChild(infoDoc.body.firstChild);
    });

    var buildings = $buildMenu.getElementsByClassName('building');
    for (var i = 0; i < buildings.length; i++) {
        var b = buildings[i];
        b.addEventListener('click', toggleClick);
        b.addEventListener('mouseenter', onEnter);
        b.addEventListener('mouseleave', onLeave);
    }


    var tabEntries = document.getElementsByClassName('tab-entry');
    for (var i = 0; i < tabEntries.length; i++) {
        tabEntries[i].addEventListener('click', tabClick)
    }
    // fake click on first
    var self = this;
    tabClick({
        currentTarget: tabEntries[0],
        initialFake: true
    });


    this.notEnoughMoneySurface = buildFont.render('Not enough resources.', '#ff0000');
    return this;
}
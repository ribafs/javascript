Astar = function(startNode, endNode) {

	this.startNode = startNode;
	this.endNode = endNode;

	this.openNodes = [];
	this.closedNodes = [];

	this.openNodes.push( startNode );
}


Astar.prototype = {


	getPath: function() {

		if( this.startNode === this.endNode ) {
			return [];
		}

		do {

			var currentNode = this.getLowestFfromOpenNodes();

			if( currentNode === this.endNode ) {
				return this.calcPathList();
			}

			this.closedNodes.push( currentNode );

			this.expandNode( currentNode );

		} while( this.openNodes.length );

		//console.log('no path found :c');
		return [];
	},


	calcPathList: function() {

		var 	currentNode = this.endNode,
			list = [];

		do {

			currentNode.isPath = true;

			list.push(currentNode);

			if( currentNode.astar.parent ) {
				currentNode = currentNode.astar.parent;
			}

		} while(currentNode !== this.startNode);

		list.reverse();

		return list;
	},


	getLowestFfromOpenNodes: function() {

		this.openNodes.sort(function(a, b) {

			return a.astar.f - b.astar.f;
		});

		//this.openNodes.reverse();

		return this.openNodes.shift();
	},


	expandNode: function( currentNode ) {

		var successors = currentNode.getNeighbours();

		for( var i=0,j=successors.length; i<j; i++ ) {

			var currSuccessor = successors[i];
			
			// wenn der Nachfolgeknoten bereits auf der Closed List ist - tue nichts
			if( this.closedNodes.indexOf( currSuccessor ) > -1 ) {
				continue;
			}

			// g Wert für den neuen Weg berechnen: g Wert des Vorgängers plus
    			// die Kosten der gerade benutzten Kante
			var tentativeG = currentNode.astar.g + 10;


			// wenn der Nachfolgeknoten bereits auf der Open List ist,
    			// aber der neue Weg nicht besser ist als der alte - tue nichts
			if( this.openNodes.indexOf( currSuccessor ) > -1 && tentativeG > currSuccessor.astar.g ) {
				continue;
			}

			// Vorgängerzeiger setzen und g Wert merken
			currSuccessor.astar.parent = currentNode;
			currSuccessor.astar.g = tentativeG;

			// f Wert des Knotens aktualisieren
			var tentativeH = Math.abs(this.endNode.x - currSuccessor.x) + Math.abs(this.endNode.y - currSuccessor.y);
			currSuccessor.astar.f = tentativeG + tentativeH;

			// bzw. Knoten mit f Wert in die Open List einfügen
			if( this.openNodes.indexOf( currSuccessor ) === -1 ) {

				this.openNodes.push( currSuccessor );
			}
		}
	}
}
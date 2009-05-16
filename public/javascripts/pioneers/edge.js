// Pioneers - web game based on the Settlers of Catan board game.

// Copyright (C) 2009 Jakub Kuźma <qoobaa@gmail.com>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var Pioneers = Pioneers || {};

Pioneers.Edge = function(board, attributes) {
    this.getPosition = function() {
        return this.position;
    };

    this.getRow = function() {
        return this.position[0];
    };

    this.getCol = function() {
        return this.position[1];
    };

    this.getBoard = function() {
        return this.board;
    };

    this.isSettled = function() {
        return this.getPlayerNumber() != null;
    };

    this.getPlayerNumber = function() {
        return this.player;
    };

    this.setPlayerNumber = function(player) {
        this.player = player;
    };

    this.getHexPositions = function() {
        if(this.getCol() % 3 == 0) {
            return [[this.getRow(), this.getCol() / 3 - 1],
                    [this.getRow(), this.getCol() / 3 - 2]];
        } else if(this.getCol() % 3 == 1) {
            return [[this.getRow() - 1, (this.getCol() - 1) / 3 - 1],
                    [this.getRow(), (this.getCol() - 1) / 3 - 1]];
        } else {
            return [[this.getRow() - 1, (this.getCol() - 2) / 3],
                    [this.getRow(), (this.getCol() - 2) / 3 - 1]];
        }
    };

    this.getHexes = function() {
        var board = this.getBoard();
        return $.map(this.getHexPositions(), function(position) {
            return board.getHex(position);
        });
    };

    this.isSettleable = function() {
        return $.grep(this.getHexes(), function(hex) {
            return hex.isSettleable();
        }).length != 0;
    };

    this.getRightNodePosition = function() {
        if(this.getCol() % 3 == 0) {
            return [this.getRow(), 2 * this.getCol() / 3 - 1];
        } else if(this.getCol() % 3 == 1) {
            return [this.getRow(), 2 * (this.getCol() - 1) / 3];
        } else {
            return [this.getRow(), 2 * (this.getCol() - 2) / 3 + 1];
        }
    };

    this.getLeftNodePosition = function() {
        if(this.getCol() % 3 == 0) {
            return [this.getRow() + 1, 2 * this.getCol() / 3 - 2];
        } else if(this.getCol() % 3 == 1) {
            return [this.getRow(), 2 * (this.getCol() - 1) / 3 - 1];
        } else {
            return [this.getRow(), 2 * (this.getCol() - 2) / 3];
        }
    };

    this.getNodePositions = function() {
        return [this.getLeftNodePosition(), this.getRightNodePosition()];
    };

    this.getLeftNode = function() {
        return this.getBoard().getNode(this.getLeftNodePosition());
    };

    this.getRightNode = function() {
        return this.getBoard().getNode(this.getRightNodePosition());
    };

    this.getNodes = function() {
        return [this.getLeftNode(), this.getRightNode()];
    };

    this.getSettlements = function(player) {
        return $.grep(this.getNodes(), function(node) {
            return node.player == player;
        });
    };

    this.hasSettlement = function(player) {
        return this.getSettlements(player).length != 0;
    };

    this.hasSettlementWithoutRoad = function(player) {
        return $.grep(this.getSettlements(player), function(settlement) {
            return !settlement.hasRoad(player);
        }).length != 0;
    };

    this.getLeftEdgePositions = function() {
        if(this.getCol() % 3 == 0) {
            return [[this.getRow() + 1, this.getCol() - 2],
                    [this.getRow() + 1, this.getCol() - 1]];
        } else if(this.getCol() % 3 == 1) {
            return [[this.getRow(), this.getCol() - 2],
                    [this.getRow(), this.getCol() - 1]];
        } else {
            return [[this.getRow() - 1, this.getCol() + 1],
                    [this.getRow(), this.getCol() - 1]];
        }
    };

    this.getRightEdgePositions = function() {
        if(this.getCol() % 3 == 0) {
            return [[this.getRow(), this.getCol() + 1],
                    [this.getRow(), this.getCol() - 1]];
        } else if(this.getCol() % 3 == 1) {
            return [[this.getRow() - 1, this.getCol() + 2],
                    [this.getRow(), this.getCol() + 1]];
        } else {
            return [[this.getRow(), this.getCol() + 2],
                    [this.getRow(), this.getCol() + 1]];
        }
    };

    this.getEdgePositions = function() {
        return $.merge(this.getLeftEdgePositions(), this.getRightEdgePositions());
    };

    this.getLeftEdges = function() {
        var board = this.getBoard();
        return $.map(this.getLeftEdgePositions(), function(position) {
            return board.getEdge(position);
        });
    };

    this.getRightEdges = function() {
        var board = this.getBoard();
        return $.map(this.getRightEdgePositions(), function(position) {
            return board.getEdge(position);
        });
    };

    this.getEdges = function() {
        return $.merge(this.getLeftEdges(), this.getRightEdges());
    };

    this.getLeftRoads = function(player) {
        var leftNode = this.getLeftNode();
        if(!leftNode.isSettled() || leftNode.getPlayer() == player) {
            return $.grep(this.getLeftEdges(), function(edge) {
                return edge.player == player;
            });
        } else {
            return [];
        }
    };

    this.getRightRoads = function(player) {
        var rightNode = this.getRightNode();
        if(!rightNode.isSettled() || rightNode.getPlayer() == player) {
            return $.grep(this.getRightEdges(), function(edge) {
                return edge.player == player;
            });
        } else {
            return [];
        }
    };

    this.getRoads = function(player) {
        return $.merge(this.getLeftRoads(player), this.getRightRoads(player));
    };

    this.hasRoad = function(player) {
        return this.getRoads(player).length != 0;
    };

    this.isValidForFirstRoad = function(player) {
        return !this.isSettled() && this.isSettleable() && this.hasSettlementWithoutRoad(player);
    };

    this.isValidForSecondRoad = this.isValidForFirstRoad;

    this.isValidForRoad = function(player) {
        return !this.isSettled() && (this.hasSettlement(player) || this.hasRoad(player));
    };

    this.init = function(board, attributes) {
        this.board = board;
        this.position = attributes.position;
        this.player = attributes.player;
    };

    this.init(board, attributes);
};

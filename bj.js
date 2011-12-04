var __ = require('underscore');

var Deck = function () {
    this.deck = [];

    __.each(['S', 'H', 'C', 'D'], function(face) {
            __.each(__.range(1, 14), function(value) {
                this.deck.push({face: face, value: value}); 
                }, this);
            }, this);

    this.shuffle = function() {
        this.deck = __.shuffle(this.deck);
    };

    this.deal = function() {
        return this.deck.pop();
    };
};

exports.Deck = Deck;

var GamePlay = function() {
    this._optimizeValues = function(values) {
        if(__.isEmpty(values)) {
            return []; 
        }
        var val = __.first(values);
        var list = this._optimizeValues(__.rest(values));
        if(val === 1) {
            var aceVal = this._simpleSum( __.rest(values, 0)) > 11 ? 1 : 11;
            list.push(aceVal);
        } else {
            list.push(val);
        }
        return list;
    };

    this._simpleSum = function(values) {
        return  __.reduce(values, function(memo, value) {
                return memo + value;
                }, 0);
    };

    this.calculate = function(hand) {
        var values = __.map(hand, function(card) {
                return card.value > 10 ? 10 : card.value;
                });
        var optimized = this._optimizeValues(values.sort());
        return this._simpleSum(optimized);
    };

    this.determineWinner = function() {
        var values = __.map(arguments, function(hand) {
            var calcValue = this.calculate(hand);
            if(hand.length === 2 && calcValue === 21) {
                calcValue += 1;
            }
            return calcValue;
        }, this);
        return __.indexOf(values, __.max(values, function(val) {return val}));
    }
};

exports.GamePlay = GamePlay;

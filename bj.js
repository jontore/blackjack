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
    this.calculate = function(hand) {
        var values = __.map(hand, function(card) {
            return card.value > 10 ? 10 : card.value;
        });
        return  __.reduce(values, function(memo, value) {
            return memo + value;
        }, 0);
    };
};

exports.GamePlay = GamePlay;

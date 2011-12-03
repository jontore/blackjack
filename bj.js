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
};

exports.Deck = Deck;

var vows = require('vows');
var assert = require('assert');

var Deck = require('../bj').Deck;

vows.describe('Deck').addBatch({
    'when creating a deck': {
        topic: new Deck(),
        'they should include 52 cards': function(topic) {
            var deck = topic.deck;
            assert.equal(52, deck.length);
        }
    }
}).run();

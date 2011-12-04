var vows = require('vows');
var assert = require('assert');
var __ = require('underscore');

var Deck = require('../bj').Deck;

vows.describe('Deck').addBatch({
    'when creating a deck': {
        topic: new Deck(),
        'they should include 52 cards': function(topic) {
            var deck = topic.deck;
            assert.equal(52, deck.length);
        },
        'should contain 13 cloves': function(topic) {
            var deck = topic.deck;
            var cloves = __.filter(deck, function(card) {
                return card.face === 'C'
            });

            assert.equal(cloves.length, 13);
        },
        'should contain 13 hearts': function(topic) {
            var deck = topic.deck;
            var hearts = __.filter(deck, function(card) {
                return card.face === 'H'
            });

            assert.equal(hearts.length, 13);
        },
        'should be shuffeled': function(topic) {
            topic.shuffle();
            var deck = topic.deck;
            var values = __.map(deck, function(card){
                return card.value;
            });

            var sortedValues = __.flatten(__.map(__.range(1, 5), function() {
                return __.range(1, 14);
            }));
            assert.notDeepEqual(values, sortedValues, 'not shuffeled');
        },
        'deal should remove one card from the top': function(topic) {
            var deck = topic.deck;
            var card1 = __.last(deck);
            var card2 = topic.deal();
            assert.equal(card1, card2);
        }
    }
}).run();

var GamePlay = require('../bj').GamePlay;

vows.describe('GamePlay').addBatch({
    'calculate value': {
        topic: new GamePlay(),
        'value of hand 3 and 4 is 7': function(topic) {
            var value = topic.calculate([{value: 3}, {value: 4}]);
            assert.equal(value, 7);
        },
        'value of hand 3 and 13 is 13': function(topic) {
            var value = topic.calculate([{value: 13}, {value: 3}]);
            assert.equal(value, 13);
        },
        'optimize values, ace is 11 when value is below 10': function(topic) {
            var values = topic._optimizeValues([9,  1]);
            assert.deepEqual([11, 9], values);
        },
        'value of hand ace and 3 is 14': function(topic) {
            var value = topic.calculate([{value: 1}, {value: 3}]);
            assert.equal(14, value);
        },
        'value af hand ace and 13 is 21': function(topic) {
            var value = topic.calculate([{value: 1}, {value: 13}]);
            assert.equal(value, 21);
        },
        'value af hand ace, 10 and 5 is 16': function(topic) {
            var value = topic.calculate([{value: 1}, {value: 10}, {value: 5}]);
            assert.equal(value, 16);
        },
        'value af hand 10 and ace is 21': function(topic) {
            var value = topic.calculate([{value: 10}, {value: 1}]);
            assert.equal(value, 21);
        }
    },
    'determine winner': {
        topic: new GamePlay(),
        'hand1 has 21 hand2 15, hand one wins': function(topic) {
            var winner = topic.determineWinner([{value: 10}, {value: 1}], [{value: 10}, {value: 5}]);
            assert.equal(winner, 0);
        },
        'hand1 has 15 hand2 21, hand2 wins': function(topic) {
            var winner = topic.determineWinner([{value: 10}, {value: 5}], [{value: 10}, {value: 1}]);
            assert.equal(winner, 1);
        },
        '21 one with 3 cards looses to bj': function(topic) {
            var winner = topic.determineWinner([{value: 7}, {value: 7}, {value: 7}], [{value: 13}, {value: 1}]);
            assert.equal(winner, 1);
        }
    }
}).run();

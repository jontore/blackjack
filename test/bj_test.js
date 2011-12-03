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

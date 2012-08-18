buster.testCase('deck', {
    setUp: function() {
        this.topic = new Deck();
    },
    'they should include 52 cards': function() {
        var deck = this.topic.deck;
        assert.equals(52, deck.length);
    },
    'should contain 13 cloves': function() {
        var deck = this.topic.deck;
        var cloves = _.filter(deck, function(card) {
            return card.face === 'C'
        });

        assert.equals(cloves.length, 13);
    },
    'should contain 13 hearts': function() {
        var deck = this.topic.deck;
        var hearts = _.filter(deck, function(card) {
            return card.face === 'H'
        });

        assert.equals(hearts.length, 13);
    },
    'should be shuffeled': function() {
        this.topic.shuffle();
        var deck = this.topic.deck;
        var values = _.map(deck, function(card){
            return card.value;
        });

        var sortedValues = _.flatten(_.map(_.range(1, 5), function() {
            return _.range(1, 14);
        }));
        refute.match(values, sortedValues, 'not shuffeled');
    },
    'deal should remove one card from the top': function() {
        var deck = this.topic.deck;
        var card1 = _.last(deck);
        var card2 = this.topic.deal();
        assert.equals(card1, card2);
    }
});

buster.testCase('Calculator calculate a value', {
    setUp: function() {
        this.topic = new Calculator();
    },
    'value of hand 3 and 4 is 7': function() {
        var value = this.topic.calculate([{value: 3}, {value: 4}]);
        assert.equals(value, 7);
    },
    'value of hand 3 and 13 is 13': function() {
        var value = this.topic.calculate([{value: 13}, {value: 3}]);
        assert.equals(value, 13);
    },
    'optimize values, ace is 11 when value is below 10': function() {
        var values = this.topic._optimizeValues([9,  1]);
        assert.equals([11, 9], values);
    },
    'value of hand ace and 3 is 14': function() {
        var value = this.topic.calculate([{value: 1}, {value: 3}]);
        assert.equals(14, value);
    },
    'value af hand ace and 13 is 21': function() {
        var value = this.topic.calculate([{value: 1}, {value: 13}]);
        assert.equals(value, 21);
    },
    'value af hand ace, 10 and 5 is 16': function() {
        var value = this.topic.calculate([{value: 1}, {value: 10}, {value: 5}]);
        assert.equals(value, 16);
    },
    'value af hand 10 and ace is 21': function() {
        var value = this.topic.calculate([{value: 10}, {value: 1}]);
        assert.equals(value, 21);
    }
});

buster.testCase('determine winner', {
    setUp: function() {
        this.topic = new GamePlay(true);
    },
    'hand1 has 21 hand2 15, hand one wins': function() {
        var winner = this.topic.determineWinner([{value: 10}, {value: 1}], [{value: 10}, {value: 5}]);
        assert.equals(winner, 0);
    },
    'hand1 has 15 hand2 21, hand2 wins': function() {
        var winner = this.topic.determineWinner([{value: 10}, {value: 5}], [{value: 10}, {value: 1}]);
        assert.equals(winner, 1);
    },
    '21 one with 3 cards looses to bj': function() {
        var winner = this.topic.determineWinner([{value: 7}, {value: 7}, {value: 7}], [{value: 13}, {value: 1}]);
        assert.equals(winner, 1);
    }
});

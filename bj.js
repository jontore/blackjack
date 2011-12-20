//var __ = require('underscore');

var Deck = function () {
    this.deck = [];

    _.each(['S', 'H', 'C', 'D'], function(face) {
            _.each(_.range(1, 14), function(value) {
                this.deck.push({face: face, value: value}); 
                }, this);
            }, this);

    document.getElementById('deck').onclick = _.bind(function() {
        this.createAndDeal();
    }, this);

    this._create = function(card, cssClass) {

        var list = document.getElementById('cards');
        var li = document.createElement('li')
        list.appendChild(li);

        var table = document.createElement('table');
        var tr =  document.createElement('tr');
        var td = document.createElement('td');
        tr.appendChild(td);
        table.appendChild(tr);
        li.appendChild(table);

        var emb = document.createElement('embed');
        emb.setAttribute('src', 'cards/' + card.face + '/' + card.value + '.svg');
        emb.setAttribute('type', 'image/svg+xml');
        td.appendChild(emb);

        return card;
    };

    this.shuffle = function() {
        this.deck = _.shuffle(this.deck);
    };

    this.deal = function() {
        return this.deck.pop();
    };

    this.createAndDeal = function() {
        return this._create(this.deal(), 'player');
    };
};

//exports.Deck = Deck;

var Calculator = function() {
    this._optimizeValues = function(values) {
        if(_.isEmpty(values)) {
            return []; 
        }
        var val = _.first(values);
        var list = this._optimizeValues(_.rest(values));
        if(val === 1) {
            var aceVal = this._simpleSum(_.rest(values, 0)) > 11 ? 1 : 11;
            list.push(aceVal);
        } else {
            list.push(val);
        }
        return list;
    };

    this._simpleSum = function(values) {
        return  _.reduce(values, function(memo, value) {
                return memo + value;
                }, 0);
    };

    this.calculate = function(hand) {
        var values = _.map(hand, function(card) {
                return card.value > 10 ? 10 : card.value;
                });
        var optimized = this._optimizeValues(values.sort());
        var sum = this._simpleSum(optimized);
        return sum > 21 ? -1 : sum;
    };
}
var GamePlay = function() {
    this.deck = new Deck();
    this.deck.shuffle();

    this.hand = [];
    this.hand.push(this.deck.createAndDeal());
    this.hand.push(this.deck.createAndDeal());

    this.ai = new Ai(this.deck);

    var calc = new Calculator();

    document.getElementById('done').onclick = _.bind(function() {
        this.done();
    }, this);

    this.determineWinner = function() {
        var values = _.map(arguments, function(hand) {
            var calcValue = calc.calculate(hand);
            if(hand.length === 2 && calcValue === 21) {
                calcValue += 1;
            }
            return calcValue;
        }, this);
        return _.indexOf(values, _.max(values, function(val) {return val}));
    }

     this.done = function() {
        var text = document.getElementById('winner');
        var winner = this.determineWinner(this.hand, this.ai.hand) > 0 ? 'the house' : 'YOU';
 
        text.innerHTML = 'The winner was ' + winner;

        _.each(this.ai.hand, function(card) {
            this.deck._create(card, 'house');        
        }, this);
     }

     this.hit = function() {
        this.hand.push(this.deck.createAndDeal());
     }

};

var Ai = function(deck) {
    this.hand = [];
    var calc = new Calculator();
    
    this._deal = function() {
        this.hand.push(deck.deal());
    }

    this._deal();
    this._deal();

    while(calc.calculate(this.hand) < 18) {
        console.log(this);
        this._deal();
    };

};

var game = new GamePlay();

//exports.GamePlay = GamePlay;


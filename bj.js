//var __ = require('underscore');

var Deck = function () {
    this.deck = [];

    var specialSym = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
    _.each(['S', 'H', 'C', 'D'], function(face) {
            _.each(_.range(1, 14), function(value) {
                var sym = specialSym[value] || value;
                this.deck.push({face: face, value: value, sym: sym}); 
                }, this);
            }, this);

    document.getElementById('deck').onclick = _.bind(function() {
        this.createAndDeal();
    }, this);

    this._create = function(card, cssClass) {

        var map = {
            1: [{c:2, r:2}],
            2: [{c: 2, r:1}, {c: 2, r:5}],
            3: [{c:2, r:1}, {c:2, r:3}, {c: 2, r:5}],
            4: [{c:1, r:1}, {c:3, r: 1}, {c:1, r: 5}, {c: 3, r: 5}],
            5: [{c:1, r:1}, {c:3, r: 1}, {c:1, r: 5}, {c: 3, r: 5}, {c:2, r: 3}],
            6: [{c:1, r:1}, {c:3, r: 1}, {c:1, r: 5},
                {c: 3, r: 5}, {c: 1, r: 3}, {c: 3, r: 3}],
            7: [{c:1, r:1}, {c:3, r: 1}, {c:1, r: 5},
                {c: 3, r: 5}, {c: 1, r: 3}, {c: 3, r: 3}, {c: 2, r: 2}],
            8: [{c:1, r:1}, {c:3, r: 1}, {c:1, r: 5}, {c: 3, r: 5},
               {c: 1, r: 3}, {c: 3, r: 3}, {c: 2, r: 2}, {c:2, r: 4}],
            9: [{c:1, r:1}, {c:1, r:2}, {c:1, r:4}, {c:1, r:5},
               {c: 3, r:1}, {c:3, r:2}, {c:3, r:4}, {c:3, r:5}, {c:2, r:3}],
            10: [{c:1, r:1}, {c:1, r:2}, {c:1, r:3}, {c:1, r:4}, {c:1, r:5},
                {c: 3, r:1}, {c:3, r:2}, {c:3, r:3}, {c:3, r:4}, {c:3, r:5}],
            11: [{c: 2, r:2}],
            12: [{c: 2, r:2}],
            13: [{c: 2, r:2}]
        };

        var sym = {
            S: '&#9824;',
            C: '&#9827;',
            H: '&#9829;',
            D: '&#9830;'
        };

        var list = document.getElementById('cards');
        var li = document.createElement('li')
        list.appendChild(li);

        var table = document.createElement('table');
        table.setAttribute('class', cssClass);
        _.each(_.range(0, 7), function(r) {
            var tr =  document.createElement('tr');
            _.each(_.range(0, 5), function(c) {
                var td = document.createElement('td');
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        li.appendChild(table);

        var positions = map[card.value];
        _.each(positions, function(pos) {
            var cell = table.rows[pos.r].cells[pos.c]; 
            if(card.value < 11) {
                cell.innerHTML = sym[card.face];
            } else {
                cell.innerHTML = card.sym;
            }
        });
        table.rows[0].cells[0].innerHTML = card.sym;
        table.rows[6].cells[4].innerHTML = card.sym;
        table.rows[0].cells[0].setAttribute('class', 'top');
        table.rows[6].cells[4].setAttribute('class', 'bottom');
        
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


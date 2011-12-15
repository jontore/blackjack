//var __ = require('underscore');

var Deck = function () {
    this.deck = [];

    _.each(['S', 'H', 'C', 'D'], function(face) {
            _.each(_.range(1, 14), function(value) {
                this.deck.push({face: face, value: value}); 
                }, this);
            }, this);

    this._create = function(card) {

        var map = {
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
                {c: 3, r:1}, {c:3, r:2}, {c:3, r:3}, {c:3, r:4}, {c:3, r:5}]
        };

        var sym = {
            S: '&#9824;',
            C: '&#9827;',
            H: '&#9829;',
            D: '&#9830;'
        }

        var list = document.getElementById('cards');
        var li = document.createElement('li')
        list.appendChild(li);

        var table = document.createElement('table');
        table.setAttribute('class', 'face');
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
            table.rows[pos.r].cells[pos.c].innerHTML = sym[card.face];
        });
        table.rows[0].cells[0].innerHTML = card.value;
        table.rows[6].cells[4].innerHTML = card.value;
    };

    this.shuffle = function() {
        this.deck = _.shuffle(this.deck);
    };

    this.deal = function() {
        return this.deck.pop();
    };
};

//exports.Deck = Deck;

var GamePlay = function() {

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
        return this._simpleSum(optimized);
    };

    this.determineWinner = function() {
        var values = _.map(arguments, function(hand) {
            var calcValue = this.calculate(hand);
            if(hand.length === 2 && calcValue === 21) {
                calcValue += 1;
            }
            return calcValue;
        }, this);
        return _.indexOf(values, _.max(values, function(val) {return val}));
    }
};

//exports.GamePlay = GamePlay;

var deck = new Deck();
deck.shuffle();

var c = deck.deal();

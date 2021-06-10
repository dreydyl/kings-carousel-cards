const abilities = require('../data/abilities.json');
const attacks = require('../data/attacks.json');
const characters = require('../data/characters.json');
const conditions = require('../data/conditions.json');
const effects = require('../data/effects.json');
const moves = require('../data/moves.json');
const CardModel = {};

function getCharacterById(id) {
    for(var i = 0;i < characters.Characters.length;i++) {
        if(characters.Characters[i].id == id) {
            return characters.Characters[i];
        }
    }
}

function parseRange(inputRange) {
    var range = [ false, false, false, false, 
        false, false, false, false,
        false, false, false, false ];
    var parsedRange = [];

    inputRange = inputRange.substring(1,inputRange.length-1);
    // console.log("inputRange: "+inputRange);

    var ranges = inputRange.split(",");
    for(var i = 0;i < ranges.length;i++) {
        // console.log("ranges[" + i + "]: "+ranges[i]);
        if(ranges[i].length <= 2) {
            // console.log("single: push " + ranges[i] + ", parsedAsInt "+parseInt(ranges[i]));
            parsedRange.push(parseInt(ranges[i]));
        } else {
            var subExpression = ranges[i].split("-");
            var minuend = parseInt(subExpression[1]);
            var subtrahend = parseInt(subExpression[0]);
            // console.log(((minuend + 12) % 12) + " - " + subtrahend + " = " + ((minuend + 12) % 12 - subtrahend));
            minuend = (minuend < subtrahend ? minuend+12 : minuend);
            for(var j = 0;j < (minuend - subtrahend)+1;j++) {
                parsedRange.push((j+subtrahend)%12);
            }
        }
    }

    for(var i = 0;i < parsedRange.length;i++) {
        // console.log(parsedRange[i]);
        range[parsedRange[i]] = true;
    }

    return range;
}

function getAttackResults(cardId) {
    var character = getCharacterById(attacks.Attacks[cardId].fk_characterid);

    var range = parseRange(attacks.Attacks[cardId].ig_range);

    var results = {
        "id": attacks.Attacks[cardId].id,
        "name": attacks.Attacks[cardId].ig_name,
        "tier": character.tier,
        "description": attacks.Attacks[cardId].description,
        "family": character.family,
        "range": range,
        "igRange": attacks.Attacks[cardId].ig_range,
        "defaultDamage": attacks.Attacks[cardId].default_damage,
        "character": character.ig_name,
        "strong": character.strong,
        "weak": character.weak
    };
    return results;
}

function getMoveResults(cardId) {
    var character = getCharacterById(moves.Moves[cardId].fk_characterid);

    var results = {
        "id": moves.Moves[cardId].id,
        "name": moves.Moves[cardId].ig_name,
        "tier": character.tier,
        "description": moves.Moves[cardId].description,
        "family": character.family,
        "distance": (parseInt(moves.Moves[cardId].distance)+12)%12,
        "igDistance": moves.Moves[cardId].distance,
        "character": character.ig_name
    }
    // console.log(results);
    return results;
}

CardModel.getAttackCardById = (cardId) => {
    for(var i = 0;i < attacks.Attacks.length;i++) {
        if(attacks.Attacks[i].id == cardId) {
            return getAttackResults(cardId);
        }
    }
}

CardModel.getAllAttacks = () => {
    var results = [];
    for(var i = 0;i < attacks.Attacks.length;i++) {
        results.push(getAttackResults(i));
    }
    return results;
};

CardModel.getAllMoves = () => {
    var results = [];
    for(var i = 0;i < moves.Moves.length;i++) {
        results.push(getMoveResults(i));
    }
    return results;
};

CardModel.getMoveCardById = (cardId) => {
    for(var i = 0;i < moves.Moves.length;i++) {
        if(moves.Moves[i].id == cardId) {
            return getMoveResults(cardId);
        }
    }
}

module.exports = CardModel;
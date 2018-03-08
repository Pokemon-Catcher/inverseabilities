'use strict';

exports.BattleAbilities = {
"adaptability": {
	//Edited
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus (STAB) of 1 instead of 1.5.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is 1 instead of 1.5.",
		onModifyMove: function (move) {
			move.stab = 1;
		},
		id: "adaptability",
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	"aftermath": {
	//Edited
		desc: "If this Pokemon is knocked out with a contact move, that move's user gains 1/4 of its maximum HP, rounded down. If any active Pokemon has the Ability Damp, this effect is prevented.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user gains 1/4 its max HP.",
		id: "aftermath",
		name: "Aftermath",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact'] && !target.hp) {
				this.heal(source.maxhp / 4, source, target);
			}
		},
		rating: 2.5,
		num: 106,
	},
	"aerilate": {
		//Edited
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Flying' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Normal';
				move.aerilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.aerilateBoosted) return this.chainModify([0x1000, 0x1333]);
		},
		id: "aerilate",
		name: "Aerilate",
		rating: 4,
		num: 185,
	},
	"airlock": {
		//willbeEdited
		shortDesc: "While this Pokemon is active, the effects of weather conditions are doubled.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Air Lock');
		},
		onAnyDamage: function (damage, target, source, effect){
			if (effect && (effect.id === 'sandstorm'||effect.id === 'hail')) {
				return damage * 2;
			}
			if (this.isWeather('sunnyday')){
				if(effect.type==='Water') return damage*2;
				if(effect.type==='Fire')return damage/2;
			}
			if (this.isWeather('raindance')){
				if(effect.type==='Water') return damage*2;
				if(effect.type==='Fire')return damage/2;
			}
		},		
		id: "airlock",
		name: "Air Lock",
		rating: 2.5,
		num: 76,
	},
	"analytic": {
		//Edited
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon) {
			let boosted = true;
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				let target = allActives[i];
				if (target === pokemon) continue;
				if (this.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([0x1000, 0x14CD]);
			}
		},
		id: "analytic",
		name: "Analytic",
		rating: 2.5,
		num: 148,
	},
	"angerpoint": {
	//Edited
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is lowers by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is lowers 12 stages.",
		onHit: function (target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({atk: -6});
				this.add('-setboost', target, 'atk', -12, '[from] ability: Anger Point');
			}
		},
		id: "angerpoint",
		name: "Anger Point",
		rating: 2,
		num: 83,
	},
	"anticipation": {
	//Edited
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is not super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, while Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a not super effective move.",
		onStart: function (pokemon) {
			let targets = pokemon.side.foe.active;
			for (let i = 0; i < targets.length; i++) {
				if (!targets[i] || targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
					if (move.category !== 'Status' && !(this.getImmunity(move.type, pokemon) && this.getEffectiveness(move.type, pokemon) < 0)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		id: "anticipation",
		name: "Anticipation",
		rating: 1,
		num: 107,
	},
	"arenatrap": {
		//Edited
		desc: "Force switch adjacent foes every turn if they are airborne.",
		shortDesc: "Force switch adjacent foes every turn if they are airborne.",
		onResidual: function (pokemon){
			let foeActive = pokemon.side.foe.active;
			for(let i in foeActive){
			if (foeActive[i].isGrounded()) {
						foeActive[i].forceSwitchFlag = true;
				}
			}
		},
		id: "arenatrap",
		name: "Arena Trap",
		rating: 4.5,
		num: 71,
	},
	"aromaveil": {
		//Edited
		desc: "Every turn this Pokemon it's allies randomly gets such effects as Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Every turn this Pokemon and it's allies randomly gets such effects as Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		onResidual: function (pokemon){
			let active = pokemon.side.active;
			for(let x in active){
				let r=Math.random();
				if(r>=5/6) x.addVolatile('attract');
				else if(r>=4/6) x.addVolatile('disable');
				else if(r>=3/6) x.addVolatile('encore');
				else if(r>=2/6) x.addVolatile('healblock');
				else if(r>=1/6) x.addVolatile('taunt');
				else if(r>=0) x.addVolatile('torment');
			}
		},
		id: "aromaveil",
		name: "Aroma Veil",
		rating: 1.5,
		num: 165,
	},
	"aurabreak": {
		//wontbeEdited
		desc: "While this Pokemon is active, the effects of the Abilities Dark Aura and Fairy Aura are reversed, multiplying the power of Dark- and Fairy-type moves, respectively, by 3/4 instead of 1.33.",
		shortDesc: "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyTryPrimaryHit: function (target, source, move) {
			if (target === source || move.category === 'Status') return;
			move.hasAuraBreak = true;
		},
		id: "aurabreak",
		name: "Aura Break",
		rating: 1.5,
		num: 188,
	},
	"baddreams": {
		//Edited
		desc: "Causes adjacent opposing Pokemon to gain 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping adjacent foes to gain 1/8 of their max HP at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (!pokemon.hp) return;
			for (let i = 0; i < pokemon.side.foe.active.length; i++) {
				let target = pokemon.side.foe.active[i];
				if (!target || !target.hp) continue;
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.heal(target.maxhp / 8, target, pokemon);
				}
			}
		},
		id: "baddreams",
		name: "Bad Dreams",
		rating: 2,
		num: 123,
	},
	"battery": {
		//Edited
		shortDesc: "This Pokemon's allies have the power of their special attacks multiplied by 10/13.",
		onBasePowerPriority: 8,
		onAllyBasePower: function (basePower, attacker, defender, move) {
			if (attacker !== this.effectData.target && move.category === 'Special') {
				this.debug('Battery boost');
				return this.chainModify([0x1000, 0x14CD]);
			}
		},
		id: "battery",
		name: "Battery",
		rating: 0,
		num: 217,
	},
	"battlearmor": {
		//Edited
		shortDesc: "This Pokemon will always be strucked by a critical hit.",
		onCriticalHit: true,
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			move.willCrit=true;
		},
		id: "battlearmor",
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	"battlebond": {
		//Edited
		desc: "If this Pokemon is a Greninja, it transforms into Ash-Greninja after knocking out a Pokemon. As Ash-Greninja, its Water Shuriken has 20 base power and always hits 3 times.",
		shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move' && source.template.speciesid === 'greninja' && source.hp && !source.transformed && source.side.foe.pokemonLeft) {
				this.add('-activate', source, 'ability: Battle Bond');
				let template = this.getTemplate('Greninja-Ash');
				source.formeChange(template);
				source.baseTemplate = template;
				source.details = template.species + (source.level === 100 ? '' : ', L' + source.level) + (source.gender === '' ? '' : ', ' + source.gender) + (source.set.shiny ? ', shiny' : '');
				this.add('detailschange', source, source.details);
			}
		},
		onModifyMove: function (move, attacker) {
			if (move.id === 'watershuriken' && attacker.template.species === 'Greninja-Ash') {
				move.multihit = 2;
			}
		},
		id: "battlebond",
		name: "Battle Bond",
		rating: 3,
		num: 210,
	},
	"beastboost": {
		//Edited
		desc: "This Pokemon's highest stat is lowered by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's highest stat is lowered by 1 if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				let stat = 'atk';
				let bestStat = 0;
				for (let i in source.stats) {
					if (source.stats[i] > bestStat) {
						stat = i;
						bestStat = source.stats[i];
					}
				}
				this.boost({[stat]:-1}, source);
			}
		},
		id: "beastboost",
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	"berserk": {
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Special Attack is lowered by 1 stage. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's Sp. Atk is lowered by 1 when it reaches 1/2 or less of its max HP.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				this.boost({spa: -1});
			}
		},
		id: "berserk",
		name: "Berserk",
		rating: 2.5,
		num: 201,
	},
	"bigpecks": {
		//Edited
		shortDesc: "This pokemon's Defense is lowered with double power by foes pokemons.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['def'] && boost['def'] < 0) {
				boost['def']*=2;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
			}
		},
		id: "bigpecks",
		name: "Big Pecks",
		rating: 0.5,
		num: 145,
	},
	"blaze": {
		//Edited	
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 10/15 while using a Fire-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Fire attacks do 10/15 damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(10/15);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(10/15);
			}
		},
		id: "blaze",
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	"bulletproof": {
		//Edited
		desc: "This Pokemon is immune to ballistic moves. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).",
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
		if (move.flags['bullet']) {
				return this.chainModify(2);
			}
		},
		id: "bulletproof",
		name: "Bulletproof",
		rating: 3.5,
		num: 171,
	},
	"cheekpouch": {
		//Edited
		desc: "If this Pokemon eats a Berry, it loses 1/3 of its maximum HP, rounded down, in addition to the Berry's effect.",
		shortDesc: "If this Pokemon eats a Berry, it loses 1/3 of its max HP after the Berry's effect.",
		onEatItem: function (item, pokemon) {
			this.damage(pokemon.maxhp / 3);
		},
		id: "cheekpouch",
		name: "Cheek Pouch",
		rating: 2,
		num: 167,
	},
	"chlorophyll": {
		//Edited
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is halved.",
		onModifySpe: function (spe) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify([1,2]);
			}
		},
		id: "chlorophyll",
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},
	"clearbody": {
		//Edited
		shortDesc: "This pokemon's stats is lowered with double power by foes pokemons.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					boost[i]*=2;
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Clear Body", "[of] " + target);
		},
		id: "clearbody",
		name: "Clear Body",
		rating: 2,
		num: 29,
	},
	"cloudnine": {
		//Edited
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Cloud Nine');
		},
		onAnyDamage: function (damage, target, source, effect){
			if (effect && (effect.id === 'sandstorm'||effect.id === 'hail')) {
				return damage * 2;
			}
			if (this.isWeather('sunnyday')){
				if(effect.type==='Water') return damage*2;
				if(effect.type==='Fire')return damage/2;
			}
			if (this.isWeather('raindance')){
				if(effect.type==='Water') return damage*2;
				if(effect.type==='Fire')return damage/2;
			}
		},		
		suppressWeather: true,
		id: "cloudnine",
		name: "Cloud Nine",
		rating: 2.5,
		num: 13,
	},
	"colorchange": {
		//Edited
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
		shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		onPrepareHit: function (source, target, move) {
			if (move.hasBounced) return;
			let type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] Protean');
			}
		},
		id: "colorchange",
		name: "Color Change",
		rating: 1,
		num: 16,
	},
	"comatose": {
		//Edited
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			return false;
		},
		id: "comatose",
		name: "Comatose",
		rating: 3,
		num: 213,
	},
	"competitive": {
		desc: "This Pokemon's Special Attack is lowered by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is lowered by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({spa: -2}, null, null, null, true);
			}
		},
		id: "competitive",
		name: "Competitive",
		rating: 2.5,
		num: 172,
	},
	"compoundeyes": {
		//Edited
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 10/13.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * (10/13);
		},
		id: "compoundeyes",
		name: "Compound Eyes",
		rating: 3.5,
		num: 14,
	},
	"contrary": {
		//Edited
		shortDesc: "If this Pokemon has a stat stage it is doubled.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				boost[i] *= 2;
			}
		},
		id: "contrary",
		name: "Contrary",
		rating: 4,
		num: 126,
	},
	"corrosion": {
		//Edited
		shortDesc: "This Pokemon can't poison pokemon.",
		onModifyMovePriority:1,
		onModifyMove:function(move){
			if(move.status=='tox'||move.status=='psn') delete move.status;
			if(move.secondary.status=='psn'||move.secondary.status=='tox') delete move.secondary;
		},
		// Implemented in sim/pokemon.js:Pokemon#setStatus
		id: "corrosion",
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	"cursedbody": {
		//Edited
		desc: "If this Pokemon is hit by an attack, there is a 30% chance that attacker rid off from a Disable.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that attacker rid off from a Disable.",
		onAfterDamage: function (damage, target, source, move) {
			if (!source || source.volatiles['disable']) return;
			if (source !== target && move && move.effectType === 'Move' && !move.isFutureMove) {
				if (this.random(10) < 3) {
					source.removeVolatile('disable', this.effectData.target);
				}
			}
		},
		id: "cursedbody",
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	"cutecharm": {
		//Edited
		desc: "There is a 30% chance a Pokemon making contact with this Pokemon will rid off from effect of Attract",
		shortDesc: "30% chance that attacker pokemon will rid off from effect of Attract.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.removeVolatile('attract', this.effectData.target);
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 1,
		num: 56,
	},
	"damp": {
		//Edited
		desc: "While this Pokemon is active, Self-Destruct, Explosion, and the Ability Aftermath have a double effect.",
		shortDesc: "While this Pokemon is active, Self-Destruct, Explosion, and Aftermath have a double effect.",
		id: "damp",
		onAnyTryMove: function (target, source, effect) {
			if (['explosion', 'mindblown', 'selfdestruct'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Damp', effect, '[of] ' + target);
			}
		},
		onHeal: function (target, source, effect, finalDamage) {
			if (effect && effect.id === 'aftermath') {
				finalDamage*=2;
			}
		},
		name: "Damp",
		rating: 1,
		num: 6,
	},
	"dancer": {
		//Edited
		desc: "While this pokemon is active, no one can to use dancing moves.",
		shortDesc: "While this pokemon is active, no one can to use dancing moves.",
		id: "dancer",
		name: "Dancer",
		onAnyTryMove: function (target, source, effect) {
			if (['featherdance', 'fierydance', 'dragondance','lunardance','petaldance','revelationdance','quiverdance','swordsdance','teeterdance'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Dancer', effect, '[of] ' + target);
				return false;
			}
		},
		// implemented in runMove in scripts.js
		rating: 2.5,
		num: 216,
	},
	"darkaura": {
		//Edited
		desc: "While this Pokemon is active, the power of Dark-type moves used by active Pokemon is multiplied by 0.77.",
		shortDesc: "While this Pokemon is active, a Dark move used by any Pokemon has 0.77x power.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark' || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x1547 : 0x0C00;
			if(move.hasAuraBreak) return this.chainModify([ move.auraBoost,0x1000]);
			
		},
		isUnbreakable: true,
		id: "darkaura",
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	"dazzling": {
		//Edited?
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies have double power.",
		shortDesc: "While this Pokemon is active, allies are weaked to opposing priority moves.",
		onFoeTryMove: function (target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				effect.chainModify(2);
			}
		},
		id: "dazzling",
		name: "Dazzling",
		rating: 3.5,
		num: 219,
	},
	"defeatist": {
		//Edited
		desc: "While this Pokemon has 1/2 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(2);
			}
		},
		id: "defeatist",
		name: "Defeatist",
		rating: 4,
		num: 129,
	},
	"defiant": {
		//Edited
		desc: "This Pokemon's Attack is lowered by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is lowered by 2 for each of its stats that is lowered by a foe.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: -2}, null, null, null, true);
			}
		},
		id: "defiant",
		name: "Defiant",
		rating: 2.5,
		num: 128,
	},
	"deltastream": {
		//willBeEdited
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('deltastream');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'deltastream' && !['desolateland', 'primordialsea', 'deltastream'].includes(weather.id)) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('deltastream')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "deltastream",
		name: "Delta Stream",
		rating: 5,
		num: 191,
	},
	"desolateland": {
		//willBeEdited
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream or Primordial Sea.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('desolateland');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'desolateland' && !['desolateland', 'primordialsea', 'deltastream'].includes(weather.id)) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('desolateland')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "desolateland",
		name: "Desolate Land",
		rating: 5,
		num: 190,
	},
	"disguise": {
		//wontBeEdited
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
		shortDesc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage.",
		onDamagePriority: 1,
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && target.template.speciesid === 'mimikyu' && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onEffectiveness: function (typeMod, target, type, move) {
			if (!this.activeTarget) return;
			let pokemon = this.activeTarget;
			if (pokemon.template.speciesid !== 'mimikyu' || pokemon.transformed || (pokemon.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates))) return;
			if (!pokemon.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate: function (pokemon) {
			if (pokemon.template.speciesid === 'mimikyu' && this.effectData.busted) {
				let template = this.getTemplate('Mimikyu-Busted');
				pokemon.formeChange(template);
				pokemon.baseTemplate = template;
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			}
		},
		id: "disguise",
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	"download": {
		//Edited
		desc: "On switch-in, this Pokemon's Attack or Special Attack is lowered by 1 stage based on the weakest combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is lowered 1 stage based on the foes' weakest Defense.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let totaldef = 0;
			let totalspd = 0;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				totaldef += foeactive[i].getStat('def', false, true);
				totalspd += foeactive[i].getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa:-1});
			} else if (totalspd) {
				this.boost({atk:-1});
			}
		},
		id: "download",
		name: "Download",
		rating: 4,
		num: 88,
	},
	"drizzle": {
		//willBeEdited
		shortDesc: "On switch-in, this Pokemon disables Rain Dance.",
		onStart: function (source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'kyogre') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			if(this.isWeather('raindance')){
				this.clearWeather();
			}
		},
		id: "drizzle",
		name: "Drizzle",
		rating: 4.5,
		num: 2,
	},
	"drought": {
		//Edited
		shortDesc: "On switch-in, this Pokemon disables Sunny Day.",
		onStart: function (source) {
			for (let i = 0; i < this.queue.length; i++) {
				if (this.queue[i].choice === 'runPrimal' && this.queue[i].pokemon === source && source.template.speciesid === 'groudon') return;
				if (this.queue[i].choice !== 'runSwitch' && this.queue[i].choice !== 'runPrimal') break;
			}
			if(this.isWeather('sunnyday')){
				this.clearWeather();
			}
		},
		id: "drought",
		name: "Drought",
		rating: 4.5,
		num: 70,
	},
	"dryskin": {
		//Edited
		desc: "This Pokemon is weak to Water-type moves and lose 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 4/5 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Sunny Day, and loses 1/8 of its maximum HP, rounded down, if the weather is Rain Dance.",
		shortDesc: "This Pokemon is hurt 1/4 by Water, 1/8 by Rain; is healed 1.25x by Fire, 1/8 by Sun.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				this.damage(target.maxhp / 4);
			}
		},
		onBasePowerPriority: 7,
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Fire') {
				return this.chainModify(4/5);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.damage(target.maxhp / 8, target, target);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.heal(target.maxhp / 8);
			}
		},
		id: "dryskin",
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	"earlybird": {
		//willBeEdited
		shortDesc: "This Pokemon's sleep counter drops by 2 instead of 1.",
		id: "earlybird",
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 2,
		num: 48,
	},
	"effectspore": {
		desc: "30% chance a Pokemon making contact with this Pokemon will be cured from poison, paralyze, or sleep.",
		shortDesc: "30% chance of cure poison/paralysis/sleep on others making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
					target.removeVolatile('slp');
					target.removeVolatile('par');
					target.removeVolatile('psn');
				}
			},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},
	"electricsurge": {
		//Edited
		shortDesc: "On switch-in, this Pokemon summons Electric Terrain.",
		onStart: function (source) {
			if(this.isTerrain('electricterrain')){
				this.clearTerrain();
			}
		},
		id: "electricsurge",
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	"emergencyexit": {
		//Edited
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it can't switch out. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage.",
		shortDesc: "This Pokemon can't switch out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				target.addVolatile('trapped', source, move, 'trapper');
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				 target.addVolatile('trapped', source, effect, 'trapper');
			}
		},
		id: "emergencyexit",
		name: "Emergency Exit",
		rating: 2,
		num: 194,
	},
	"fairyaura": {
		desc: "While this Pokemon is active, the power of Fairy-type moves used by active Pokemon is multiplied by 0.77x.",
		shortDesc: "While this Pokemon is active, a Fairy move used by any Pokemon has 0.77x power.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePower: function (basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Fairy' || move.auraBoost) return;
			move.auraBoost = move.hasAuraBreak ? 0x1547 : 0x0C00;
			return this.chainModify([move.auraBoost, 0x1000]);
		},
		isUnbreakable: true,
		id: "fairyaura",
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	"filter": {
		//Edited
		shortDesc: "This Pokemon receives 4/3 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(4/3);
			}
		},
		id: "filter",
		name: "Filter",
		rating: 3,
		num: 111,
	},
	"flamebody": {
		//Edited
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be cured from burn.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					target.removeVolatile('brn');
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	"flareboost": {
		//Edited
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 10/15.",
		shortDesc: "While this Pokemon is burned, its special attacks have 10/15 power.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(10/15);
			}
		},
		id: "flareboost",
		name: "Flare Boost",
		rating: 2.5,
		num: 138,
	},
	"flashfire": {
		//Edited
		desc: "This Pokemon weaks to Fire-type moves. The first time it is hit by a Fire-type move, its attacking stat is multiplied by 2/3 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 2/3 damage if hit by one Fire move; Fire weak 2x.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]', '[from] ability: Flash Fire');
				}
				move.chainModify(2);
			}
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(2/3);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA: function (atk, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return this.chainModify(2/3);
				}
			},
			onEnd: function (target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18,
	},
	"flowergift": {
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart: function (pokemon) {
			delete this.effectData.forme;
		},
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine');
					this.add('-formechange', pokemon, 'Cherrim-Sunshine', '[msg]', '[from] ability: Flower Gift');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim');
					this.add('-formechange', pokemon, 'Cherrim', '[msg]', '[from] ability: Flower Gift');
				}
			}
		},
		onModifyAtkPriority: 3,
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 4,
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(1.5);
			}
		},
		id: "flowergift",
		name: "Flower Gift",
		rating: 2.5,
		num: 122,
	},
	"flowerveil": {
		//willBeEdited
		desc: "Grass-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost: function (boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add('-fail', this.effectData.target, 'unboost', '[from] ability: Flower Veil', '[of] ' + target);
		},
		onAllySetStatus: function (status, target, source, effect) {
			if (target.hasType('Grass')) {
				if (!effect || !effect.status) return false;
				this.add('-activate', this.effectData.target, 'ability: Flower Veil', '[of] ' + target);
				return null;
			}
		},
		id: "flowerveil",
		name: "Flower Veil",
		rating: 0,
		num: 166,
	},
	"fluffy": {
		desc: "This Pokemon receives 2x damage from contact moves, but 1/2 damage from Fire moves.",
		shortDesc: "This Pokemon takes 2x damage from contact moves, 1/2 damage from Fire moves.",
		onSourceModifyDamage: function (damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod /= 2;
			if (move.flags['contact']) mod *= 2;
			return this.chainModify(mod);
		},
		id: "fluffy",
		name: "Fluffy",
		rating: 2.5,
		num: 218,
	},
	"forecast": {
		//wontBeEdited
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.template.speciesid !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.template.speciesid !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
				if (pokemon.template.speciesid !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.template.speciesid !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme);
				this.add('-formechange', pokemon, forme, '[msg]', '[from] ability: Forecast');
			}
		},
		id: "forecast",
		name: "Forecast",
		rating: 3,
		num: 59,
	},
	"forewarn": {
		//Edited
		desc: "On switch-in, this Pokemon is alerted to the move with the lowest power, at random, known by an opposing Pokemon.",
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the lowest power.",
		onStart: function (pokemon) {
			let targets = pokemon.side.foe.active;
			let warnMoves = [];
			let warnBp = 160;
			for (let i = 0; i < targets.length; i++) {
				if (targets[i].fainted) continue;
				for (let j = 0; j < targets[i].moveset.length; j++) {
					let move = this.getMove(targets[i].moveset[j].move);
					let bp = move.basePower;
					if (move.ohko) bp = 160;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp < warnBp) {
						warnMoves = [[move, targets[i]]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, targets[i]]);
					}
				}
			}
			if (!warnMoves.length) return;
			let warnMove = warnMoves[this.random(warnMoves.length)];
			this.add('-activate', pokemon, 'ability: Forewarn', warnMove[0], '[of] ' + warnMove[1]);
		},
		id: "forewarn",
		name: "Forewarn",
		rating: 1,
		num: 108,
	},
	"friendguard": {
		//Edited
		shortDesc: "This Pokemon's allies receive 4/3 damage from other Pokemon's attacks.",
		id: "friendguard",
		name: "Friend Guard",
		onAnyModifyDamage: function (damage, source, target, move) {
			if (target !== this.effectData.target && target.side === this.effectData.target.side) {
				this.debug('Friend Guard weaken');
				return this.chainModify(4/3);
			}
		},
		rating: 0,
		num: 132,
	},
	"frisk": {
		//Edited
		shortDesc: "On switch-in, this Pokemon identifies the held items of all friendly Pokemon.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.active;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || foeactive[i].fainted) continue;
				if (foeactive[i].item) {
					this.add('-item', foeactive[i], foeactive[i].getItem().name, '[from] ability: Frisk', '[of] ' + pokemon, '[identify]');
				}
			}
		},
		id: "frisk",
		name: "Frisk",
		rating: 1.5,
		num: 119,
	},
	"fullmetalbody": {
		//Edited
		desc: "Boosts other Pokemon lowering this Pokemon's stat stages. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "Boosts other Pokemon lowering this Pokemon's stat stages",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					boost[i]*=2;
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", "[of] " + target);
		},
		isUnbreakable: true,
		id: "fullmetalbody",
		name: "Full Metal Body",
		rating: 2,
		num: 230,
	},
	"furcoat": {
		//Edited
		shortDesc: "This Pokemon's Defense is halved.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(1/2);
		},
		id: "furcoat",
		name: "Fur Coat",
		rating: 3.5,
		num: 169,
	},
	"galewings": {
		//Edited
		shortDesc: "If this Pokemon is at full HP, its Flying-type moves have their priority decreased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Flying' && pokemon.hp === pokemon.maxhp) return priority - 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 3,
		num: 177,
	},
	"galvanize": {
		//Edited
		desc: "This Pokemon's Normal-type moves become Electric-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Electric type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Electric' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Normal';
				move.galvanizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.galvanizeBoosted) return this.chainModify([0x1000, 0x1333]);
		},
		id: "galvanize",
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	"gluttony": {
		//willBeEdited
		shortDesc: "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.",
		id: "gluttony",
		name: "Gluttony",
		rating: 1.5,
		num: 82,
	},
	"gooey": {
		//Edited
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Gooey');
				this.boost({spe: 1}, source, target, null, true);
			}
		},
		id: "gooey",
		name: "Gooey",
		rating: 2.5,
		num: 183,
	},
	"grasspelt": {
		//Edited
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 2/3.",
		onModifyDefPriority: 6,
		onModifyDef: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return this.chainModify(2/3);
		},
		id: "grasspelt",
		name: "Grass Pelt",
		rating: 1,
		num: 179,
	},
	"grassysurge": {
		//Edited
		shortDesc: "On switch-in, this Pokemon unsummons Grassy Terrain.",
		onStart: function (source) {
			if(this.isTerrain('grassyterrain')){
				this.clearTerrain();
			}
		},
		id: "grassysurge",
		name: "Grassy Surge",
		rating: 4,
		num: 229,
	},
	"guts": {
		//Edited
		desc: "If this Pokemon has a major status condition, its Attack is multiplied by 2/3; ",
		shortDesc: "If this Pokemon is statused, its Attack is 2/3;",
		onModifyAtkPriority: 6,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2/3);
			}
		},
		id: "guts",
		name: "Guts",
		rating: 3,
		num: 62,
	},
	"harvest": {
		//Edited
		desc: "If the last item this Pokemon used is a Berry, there is a 100% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 50%.",
		shortDesc: "If last item used is a Berry, 100% chance to restore it each end of turn. 50% in Sun.",
		id: "harvest",
		name: "Harvest",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland']) || this.random(2) === 0) {
				if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		rating: 2.5,
		num: 139,
	},
	"healer": {
		//willBeEdited
		desc: "There is a 30% chance of curing an adjacent ally's major status condition at the end of each turn.",
		shortDesc: "30% chance of curing an adjacent ally's status at the end of each turn.",
		id: "healer",
		name: "Healer",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].hp && this.isAdjacent(pokemon, allyActive[i]) && allyActive[i].status && this.random(10) < 3) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive[i].cureStatus();
				}
			}
		},
		rating: 0,
		num: 131,
	},
	"heatproof": {
		//Edited
		desc: "The power of Fire-type attacks against this Pokemon is doubled, and burn damage taken is doubled.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is doubled; burn damage doubled.",
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage * 2;
			}
		},
		id: "heatproof",
		name: "Heatproof",
		rating: 2.5,
		num: 85,
	},
	"heavymetal": {
		//Edited
		shortDesc: "This Pokemon's weight is halved.",
		onModifyWeight: function (weight) {
			return weight / 2;
		},
		id: "heavymetal",
		name: "Heavy Metal",
		rating: -1,
		num: 134,
	},
	"honeygather": {
		//wontBeEdited
		shortDesc: "No competitive use.",
		id: "honeygather",
		name: "Honey Gather",
		rating: 0,
		num: 118,
	},
	"hugepower": {
		//Edited
		shortDesc: "This Pokemon's Attack is halved.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(0.5);
		},
		id: "hugepower",
		name: "Huge Power",
		rating: 5,
		num: 37,
	},
	"hustle": {
		//Edited
		desc: "This Pokemon's Attack is multiplied by 2/3 and the accuracy of its physical attacks is multiplied by 5/4",
		shortDesc: "This Pokemon's Attack is 2/3 and accuracy of its physical attacks is 5/4.",
		// This should be applied directly to the stat as opposed to chaining witht he others
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.modify(atk, 2/3);
		},
		onModifyMove: function (move) {
			if (move.category === 'Physical' && typeof move.accuracy === 'number') {
				move.accuracy *= 5/4;
			}
		},
		id: "hustle",
		name: "Hustle",
		rating: 3,
		num: 55,
	},
	"hydration": {
		//Edited
		desc: "This Pokemon has its major status condition cured at the end of each turn if Rain Dance is active.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				if(!pokemon.status){
					let r=this.random(6);
					if(r>5)pokemon.trySetStatus('frz');
					else if(r>4)pokemon.trySetStatus('brn');
					else if(r>3)pokemon.trySetStatus('par');
					else if(r>2)pokemon.trySetStatus('slp');
					else if(r>1)pokemon.trySetStatus('psn');
					else pokemon.trySetStatus('tox');
				} else if(pokemon.statusData.time<2){
					pokemon.statusData.time++;
				}
			}
		},
		id: "hydration",
		name: "Hydration",
		rating: 2,
		num: 93,
	},
	"hypercutter": {
		//Edited
		shortDesc: "Doubles other Pokemon's lowering this Pokemon's Attack stat stage.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['atk'] && boost['atk'] < 0) {
				boost['atk']*=2;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
			}
		},
		id: "hypercutter",
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52,
	},
	"icebody": {
		//Edited
		desc: "If Hail is active, this Pokemon loses 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Hail is active, this Pokemon loses 1/16 of its max HP each turn;",
		onWeather: function (target, source, effect) {
			if (effect.id === 'hail') {
				this.damage(target.maxhp / 16,target);
			}
		},
		id: "icebody",
		name: "Ice Body",
		rating: 1.5,
		num: 115,
	},
	"illuminate": {
		shortDesc: "No competitive use.",
		id: "illuminate",
		name: "Illuminate",
		rating: 0,
		num: 35,
	},
	"illusion": {
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				if (!pokemon.side.pokemon[i].fainted) break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			pokemon.illusion = pokemon.side.pokemon[i];
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (target.illusion && effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.singleEvent('End', this.getAbility('Illusion'), target.abilityData, target, source, effect);
			}
		},
		onEnd: function (pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				let details = pokemon.template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
			}
		},
		onFaint: function (pokemon) {
			pokemon.illusion = null;
		},
		isUnbreakable: true,
		id: "illusion",
		name: "Illusion",
		rating: 4,
		num: 149,
	},
	"immunity": {
		//Edited
		shortDesc: "This Pokemon is always poisoned. It has immunity to others statuses.",
		onUpdate: function (pokemon) {
				pokemon.trySetStatus('psn');
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox'){
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			return false;}
		},
		id: "immunity",
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	"imposter": {
		//Edited
		desc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it. If there is no Pokemon at that position, this Pokemon does not Transform.",
		shortDesc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.",
		onStart: function (pokemon) {
			if (this.activeMove && this.activeMove.id === 'skillswap') return;
			let target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				target.transformInto(pokemon, target, this.getAbility('imposter'));
			}
		},
		id: "imposter",
		name: "Imposter",
		rating: 4.5,
		num: 150,
	},
	"infiltrator": {
		//Edited
		desc: "This Pokemon's moves half its power against substitutes and the opposing side's Reflect, Light Screen, Safeguard, Mist and Aurora Veil.",
		shortDesc: "Moves half power against substitutes and foe's Reflect/Light Screen/Safeguard/Mist/Aurora Veil.",
		onSourceHit: function (target, source, move) {
			if(target.volatiles['substitute'])this.chainModify(0.5);
		},
		id: "infiltrator",
		name: "Infiltrator",
		rating: 3,
		num: 151,
	},
	"innardsout": {
		//Edited
		desc: "If this Pokemon is knocked out with a move, that move's user gains HP equal to the amount of damage inflicted on this Pokemon.",
		shortDesc: "If this Pokemon is KOed with a move, that move's user gains an equal amount of HP.",
		id: "innardsout",
		name: "Innards Out",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.effectType === 'Move' && !target.hp) {
				this.heal(damage, target);
			}
		},
		rating: 2.5,
		num: 215,
	},
	"innerfocus": {
		//Edited
		shortDesc: "This Pokemon will always be flinched.",
		onTryHit: function(pokemon){
			pokemon.addVolatile('flinch');
		},
		id: "innerfocus",
		name: "Inner Focus",
		rating: 1.5,
		num: 39,
	},
	"insomnia": {
		//Edited
		desc: "This Pokemon cannot be statused, and is considered to be asleep. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon cannot be statused, and is considered to be asleep.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Insomnia');
		},
		onSetStatus: function (status, target, source, effect) {
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Insomnia');
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		isUnbreakable: true,
		id: "insomnia",
		name: "Insomnia",
		rating: 2,
		num: 15,
	},
	"intimidate": {
		//Edited
		desc: "On switch-in, this Pokemon raises the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon raises the Attack of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({atk: +1}, foeactive[i], pokemon);
				}
			}
		},
		id: "intimidate",
		name: "Intimidate",
		rating: 3.5,
		num: 22,
	},
	"ironbarbs": {
		//Edited
		desc: "Pokemon making contact with this Pokemon gains 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon gains 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.heal(source.maxhp / 8, source, target);
			}
		},
		id: "ironbarbs",
		name: "Iron Barbs",
		rating: 3,
		num: 160,
	},
	"ironfist": {
		//Edited
		desc: "This Pokemon's punch-based attacks have their power multiplied by 5/6.",
		shortDesc: "This Pokemon's punch-based attacks have 5/6 power. Sucker Punch is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([0x1000, 0x1333]);
			}
		},
		id: "ironfist",
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	"justified": {
		//Edited
		shortDesc: "This Pokemon's Attack is lowers by 1 stage after it is damaged by a Dark-type move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.type === 'Dark') {
				this.boost({atk:-1});
			}
		},
		id: "justified",
		name: "Justified",
		rating: 2,
		num: 154,
	},
	"keeneye": {
		//Edited
		desc: "Doubles other Pokemon's lowering this Pokemon's accuracy stat stage. This Pokemon doubles a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy is lowered by others with double power; doubles their evasiveness stat.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			if (boost['accuracy'] && boost['accuracy'] < 0) {
				boost['accuracy']*=2;
				if (!effect.secondaries) this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", "[of] " + target);
			}
		},
		onTryMove: function (target, source, effect){
			target.evasion*=2;
		},
		id: "keeneye",
		name: "Keen Eye",
		rating: 1,
		num: 51,
	},
	"klutz": {
		//willBeEdited
		desc: "This pokemon's held item has double effects.",
		shortDesc: "This pokemon's held item has double effects.",
		// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		id: "klutz",
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	"leafguard": {
		//Edited
		desc: "If Sunny Day is active, this Pokemon gets random status.",
		shortDesc: "If Sunny Day is active, this Pokemon gets random status",
		onSetStatus: function (status, target, source, effect) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-activate', pokemon, 'ability: Leaf Guard');
				if(!pokemon.status){
					let r=this.random(6);
					if(r>5)pokemon.trySetStatus('frz');
					else if(r>4)pokemon.trySetStatus('brn');
					else if(r>3)pokemon.trySetStatus('par');
					else if(r>2)pokemon.trySetStatus('slp');
					else if(r>1)pokemon.trySetStatus('psn');
					else pokemon.trySetStatus('tox');
				} else if(pokemon.statusData.time<2){
					pokemon.statusData.time++;
				}
			}
		},
		id: "leafguard",
		name: "Leaf Guard",
		rating: 1,
		num: 102,
	},
	"levitate": {
		//willBeEdited
		desc: "This Pokemon is immune to Ground. Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity.",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.",
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		id: "levitate",
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	"lightmetal": {
		//Edited
		shortDesc: "This Pokemon's weight is doubled.",
		onModifyWeight: function (weight) {
			return weight * 2;
		},
		id: "lightmetal",
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	"lightningrod": {
		//Edited
		desc: "This Pokemon weaks to Electric-type moves and raises its Special Attack by 1 stage when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon weaks Electric moves and lowers Sp. Atk by 1 when hit by them",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spa:-1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Lightning Rod');
				}
				move.chainModify(2);
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Electric' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Lightning Rod');
				}
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightning Rod",
		rating: 3.5,
		num: 32,
	},
	"limber": {
		//Edited
		shortDesc: "This Pokemon is always paralyzed.",
		onUpdate: function (pokemon) {
			if (!pokemon.status) {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.trySetStatus('par');
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'par'){
			this.add('-immune', target, '[msg]', '[from] ability: Limber');
			return false;}
		},
		id: "limber",
		name: "Limber",
		rating: 1.5,
		num: 7,
	},
	"liquidooze": {
		//Edited
		shortDesc: "This Pokemon heals 2x if attacked by draining moves",
		id: "liquidooze",
		onSourceTryHeal: function (damage, target, source, effect) {
			this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
			let canOoze = {drain: 1, leechseed: 1, strengthsap: 1};
			if (canOoze[effect.id]) {
				this.heal(damage);
			}
		},
		name: "Liquid Ooze",
		rating: 1.5,
		num: 64,
	},
	"liquidvoice": {
		//Edited
		desc: "This Pokemon's Water-type moves become sound-based moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Water type moves become sound-based.",
		onModifyMovePriority: -1,
		onModifyMove: function (move) {
			if (move.type('Water')) {
				move.flags['sound']=1;
			}
		},
		id: "liquidvoice",
		name: "Liquid Voice",
		rating: 2.5,
		num: 204,
	},
	"longreach": {
		//Edited
		shortDesc: "This Pokemon's attacks always make contact with the target.",
		onModifyMove: function (move) {
			move.flags['contact']=1;
		},
		id: "longreach",
		name: "Long Reach",
		rating: 1.5,
		num: 203,
	},
	"magicbounce": {
		//Edited
		desc: "This Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "This Pokemon blocks certain status moves and bounces them back to the user.",
		id: "magicbounce",
		name: "Magic Bounce",
		onTryHitPriority: 1,
		onSourceTryHit: function (target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side != source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 4.5,
		num: 156,
	},
	"magicguard": {
		//Edited
		desc: "This Pokemon can only be damaged by not direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.",
		shortDesc: "This Pokemon can only be damaged by not direct attacks.",
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType != 'Move') {
				this.chainModify(2);
			}
		},
		id: "magicguard",
		name: "Magic Guard",
		rating: 4.5,
		num: 98,
	},
	"magician": {
		//Edited
		desc: "If this Pokemon has item, it gives the item to a Pokemon it hits with an attack. Does not affect Doom Desire and Future Sight.",
		shortDesc: "If this Pokemon has item, it gives the item to a Pokemon it hits with an attack.",
		onSourceHit: function (target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status') {
				if (!source.item||target.item) return;
				let yourItem = source.takeItem(target);
				if (!yourItem) return;
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-item', target, yourItem, '[from] ability: Magician', '[of] ' + source);
			}
		},
		id: "magician",
		name: "Magician",
		rating: 1.5,
		num: 170,
	},
	"magmaarmor": {
		//Edited
		shortDesc: "This Pokemon is always frozen. ",
		onUpdate: function (pokemon) {
			if (!pokemon.status) {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.trySetStatus('frz');
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'frz'){
			this.add('-immune', target, '[msg]', '[from] ability: Magma Armor');
			return false;}
		},
		id: "magmaarmor",
		name: "Magma Armor",
		rating: 0.5,
		num: 40,
	},
	"magnetpull": {
		//Edited
		desc: "Switches adjacent opposing Steel-type Pokemon.",
		shortDesc: "Switches adjacent opposing Steel-type Pokemon.",
		onResidual: function (pokemon){
			let foeActive = pokemon.side.foe.active;
			for(let i in foeActive){
			if (foeActive[i].hasType('Steel')) {
						foeActive[i].forceSwitchFlag = true;
				}
			}
		},
		id: "magnetpull",
		name: "Magnet Pull",
		rating: 4.5,
		num: 42,
	},
	"marvelscale": {
		//Edited
		desc: "If this Pokemon has a major status condition, its Defense is multiplied by 2/3.",
		shortDesc: "If this Pokemon is statused, its Defense is 2/3x.",
		onModifyDefPriority: 6,
		onModifyDef: function (def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2/3);
			}
		},
		id: "marvelscale",
		name: "Marvel Scale",
		rating: 2.5,
		num: 63,
	},
	"megalauncher": {
		//Edited
		desc: "This Pokemon's pulse moves have their power multiplied by 2/3. Heal Pulse restores 1/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 2/3 power. Heal Pulse heals 1/4 target's max HP.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(2/3);
			}
		},
		id: "megalauncher",
		name: "Mega Launcher",
		rating: 3.5,
		num: 178,
	},
	"merciless": {
		//Edited
		shortDesc: "This Pokemon's attacks are never critical hits if the target is poisoned.",
		onModifyCritRatio: function (critRatio, source, target) {
			if (target && ['psn', 'tox'].includes(target.status)) return 0;
		},
		id: "merciless",
		name: "Merciless",
		rating: 2,
		num: 196,
	},
	"minus": {
		//Edited
		desc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Special Attack is multiplied by 2/3",
		shortDesc: "If an active ally has this Ability or the Ability Plus, this Pokemon's Sp. Atk is 2/3.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(2/3);
				}
			}
		},
		id: "minus",
		name: "Minus",
		rating: 0,
		num: 58,
	},
	"mistysurge": {
		//Edited
		shortDesc: "On switch-in, this Pokemon clear Misty Terrain.",
		onStart: function (source) {
			if(this.isTerrain('mistyterrain')){
				this.clearTerrain();
			}
		},
		id: "mistysurge",
		name: "Misty Surge",
		rating: 4,
		num: 228,
	},
	"moldbreaker": {
		//willBeEdited
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onModifyMove: function (move) {
			move.ignoreAbility = true;
		},
		id: "moldbreaker",
		name: "Mold Breaker",
		rating: 3.5,
		num: 104,
	},
	"moody": {
		//Edited
		desc: "This Pokemon has a random stat lowered by 2 stages and another stat raised by 1 stage at the end of each turn.",
		shortDesc: "Lowers a random stat by 2 and raises another stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 1;

			stats = [];
			for (let statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -2;

			this.boost(boost);
		},
		id: "moody",
		name: "Moody",
		rating: 5,
		num: 141,
	},
	"motordrive": {
		//Edited
		desc: "This Pokemon weaks to Electric-type moves and lowers its Speed by 1 stage when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is lowers 1 stage if hit by an Electric move; Electric weak.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe:-1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Motor Drive');
				}
				move.chainModify(2);
			}
		},
		id: "motordrive",
		name: "Motor Drive",
		rating: 3,
		num: 78,
	},
	"moxie": {
		//Edited
		desc: "This Pokemon's Attack is lowered by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is lowered by 1 stage if it attacks and KOes another Pokemon.",
		onSourceFaint: function (target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk:-1}, source);
			}
		},
		id: "moxie",
		name: "Moxie",
		rating: 3.5,
		num: 153,
	},
	"multiscale": {
		//Edited
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is doubled.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(2);
			}
		},
		id: "multiscale",
		name: "Multiscale",
		rating: 4,
		num: 136,
	},
	"multitype": {
		//wontBeEdited
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.",
		// Multitype's type-changing itself is implemented in statuses.js
		id: "multitype",
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	"mummy": {
		//Edited
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect the Abilities Multitype or Stance Change.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		id: "mummy",
		name: "Mummy",
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				let oldAbility = target.setAbility(source.ability, source, 'mummy', true);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.getAbility(oldAbility).name, '[of] ' + source);
				}
			}
		},
		rating: 2,
		num: 152,
	},
	"naturalcure": {
		//Edited
		shortDesc: "This Pokemon gets random major status condition when it switches out.",
		onCheckShow: function (pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;

			let active = pokemon.side.active;
			let cureList = [];
			let noCureCount = 0;
			for (let i = 0; i < active.length; i++) {
				let curPoke = active[i];
				// pokemon not statused
				if (!curPoke || !curPoke.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				let template = this.getTemplate(curPoke.species);
				// pokemon can't get Natural Cure
				if (Object.values(template.abilities).indexOf('Natural Cure') < 0) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!template.abilities['1'] && !template.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}

				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}

			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured

				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', "(" + cureList.length + " of " + pokemon.side.name + "'s pokemon " + (cureList.length === 1 ? "was" : "were") + " cured by Natural Cure.)");

				for (let i = 0; i < cureList.length; i++) {
					cureList[i].showCure = false;
				}
			}
		},
		onSwitchOut: function (pokemon) {
			if (pokemon.status) return;
			let r=this.random(6);
			if(r>5)pokemon.setStatus('frz');
			else if(r>4)pokemon.setStatus('brn');
			else if(r>3)pokemon.setStatus('par');
			else if(r>2)pokemon.setStatus('slp');
			else if(r>1)pokemon.setStatus('psn');
			else pokemon.setStatus('tox');
		},
		id: "naturalcure",
		name: "Natural Cure",
		rating: 3.5,
		num: 30,
	},
	"neuroforce": {
		//Edited
		shortDesc: "This Pokemon's attacks that are super effective against the target do 5/6 damage.",
		onModifyDamage: function (damage, source, target, move) {
			if (move && move.typeMod > 0) {
				return this.chainModify([0x1000, 0x1333]);
			}
		},
		id: "neuroforce",
		name: "Neuroforce",
		rating: 3.5,
		num: 233,
	},
	"noguard": {
		//Edited
		shortDesc: "Every move used by or against this Pokemon will always miss.",
		onAnyAccuracy: function (accuracy, target, source, move) {
			if (move && (source === this.effectData.target || target === this.effectData.target)) {
				return false;
			}
			return accuracy;
		},
		id: "noguard",
		name: "No Guard",
		rating: 4,
		num: 99,
	},
	"normalize": {
		//Edited
		desc: "This Pokemon's moves are changed to be HP type and have their power multiplied by 6/5. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be  HP type and have 6/5 power.",
		onModifyMovePriority: 1,
		onModifyMove: function (move, pokemon) {
			if (!(move.isZ && move.category !== 'Status') && !['hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'weatherball'].includes(move.id)) {
				move.type = pokemon.hpType;
				move.normalizeBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.normalizeBoosted) return this.chainModify([0x1000, 0x1333]);
		},
		id: "normalize",
		name: "Normalize",
		rating: -1,
		num: 96,
	},
	"oblivious": {
		desc: "This Pokemon always infatuated and taunted.",
		shortDesc: "This Pokemon always infatuated and taunted.",
		onUpdate: function (pokemon) {
			if (!pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.addVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (!pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.addVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		id: "oblivious",
		name: "Oblivious",
		rating: 1,
		num: 12,
	},
	"overcoat": {
		//Edited
		shortDesc: "This Pokemon is weak to powder moves and have 2x damage from Sandstorm or Hail to itself.",
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'sandstorm'||effect.effectType !== 'hail') {
				damage*=2;
			}
		},
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (move.flags['powder'] && target !== source && this.getImmunity('powder', target)) {
				move.accuracy=100;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (!move.flags['powder']) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Overcoat');
				}
				return this.effectData.target;
			}
		},
		id: "overcoat",
		name: "Overcoat",
		rating: 2.5,
		num: 142,
	},
	"overgrow": {
		//Edited
		desc: "When this Pokemon has 1/3 or less of its maximum HP, its attacking stat is multiplied by 2/3 while using a Grass-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Grass attacks do 2/3x damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(2/3);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(2/3);
			}
		},
		id: "overgrow",
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	"owntempo": {
		//Edited
		shortDesc: "This Pokemon is always confused.",
		onUpdate: function (pokemon) {
			if (!pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.setVolatile('confusion');
			}
		},
		id: "owntempo",
		name: "Own Tempo",
		rating: 1.5,
		num: 20,
	},
	"parentalbond": {
		//Edited
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		onBeforeMovePriority: 9,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
		effect: {
			duration: 2,
		},
		id: "parentalbond",
		name: "Parental Bond",
		rating: 5,
		num: 184,
	},
	"pickup": {
		//Edited
		shortDesc: "If adjacent Pokemon has no item, it finds one used by your Pokemon this turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let allActives = pokemon.side.active.concat(pokemon.side.foe.active);
			for (let i = 0; i < allActives.length; i++) {
				let target = allActives[i];
				if (!target.item && this.isAdjacent(pokemon, target)) {
					target.setItem(pokemon.lastItem);
					let item = target.getItem();
					this.add('-item', target, item, '[from] ability: Pickup');
				}
			}
		},
		id: "pickup",
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	"pickpocket": {
		//Edited
		desc: "If this Pokemon has item, it gives the item to a Pokemon that makes contact with it. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "If this Pokemon has  item, it gives the item to a Pokemon making contact with it.",
		onAfterMoveSecondary: function (target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				if (!target.item) {
					return;
				}
				let yourItem = target.takeItem(source);
				if (yourItem) {
					return;
				}
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id;
					return;
				}
				this.add('-item', source, yourItem, '[from] ability: Pickpocket', '[of] ' + source);
			}
		},
		id: "pickpocket",
		name: "Pickpocket",
		rating: 1,
		num: 124,
	},
	"pixilate": {
		//Edited
		desc: "This Pokemon's Fairy-type moves become Normal-type moves and have their power multiplied by 5/6. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Fairy-type moves become Normal type and have 5/6x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Fairy' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Normal';
				move.pixilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([0x1000, 0x1333]);
		},
		id: "pixilate",
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	"plus": {
		//Edited
		desc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Special Attack is multiplied by 2/3.",
		shortDesc: "If an active ally has this Ability or the Ability Minus, this Pokemon's Sp. Atk is 2/3.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			let allyActive = pokemon.side.active;
			if (allyActive.length === 1) {
				return;
			}
			for (let i = 0; i < allyActive.length; i++) {
				if (allyActive[i] && allyActive[i].position !== pokemon.position && !allyActive[i].fainted && allyActive[i].hasAbility(['minus', 'plus'])) {
					return this.chainModify(2/3);
				}
			}
		},
		id: "plus",
		name: "Plus",
		rating: 0,
		num: 57,
	}, 
	"poisonheal": {
		//Edited
		desc: "If this Pokemon is poisoned, it loses 1/8 of its maximum HP, rounded down, at the end of each turn",
		shortDesc: "This Pokemon is loses by 1/8 of its max HP each turn when poisoned;",
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.damage(target.maxhp / 8);
			}
		},
		id: "poisonheal",
		name: "Poison Heal",
		rating: 4,
		num: 90,
	},
	"poisonpoint": {
		//Edited
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be cured from poisoning.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					source.removeVolatile('psn');
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: 38,
	},
	"poisontouch": {
		//Edited
		shortDesc: "This Pokemon's contact moves have a 30% chance curing of poisoning.",
		// upokecenter says this is implemented as an added secondary effect
		onModifyMove: function (move) {
			if (!move || !move.flags['contact']) return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				onHit: function (target) {
				if (target.status === 'psn') target.cureStatus();
				},
				ability: this.getAbility('poisontouch'),
			});
		},
		id: "poisontouch",
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	"powerconstruct": {
		//wontBeEdited
		desc: "If this Pokemon is a Zygarde in its 10% or 50% Forme, it changes to Complete Forme when it has 1/2 or less of its maximum HP at the end of the turn.",
		shortDesc: "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.template.speciesid === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			let template = this.getTemplate('Zygarde-Complete');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);
			pokemon.setAbility(template.abilities['0']);
			pokemon.baseAbility = pokemon.ability;
			let newHP = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		id: "powerconstruct",
		name: "Power Construct",
		rating: 4,
		num: 211,
	},
	"powerofalchemy": {
		//willBeEdited
		desc: "This Pokemon copies the Ability of an foe that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an foe that faints.",
		onFoeFaint: function (target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {comatose:1, flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Power of Alchemy', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "powerofalchemy",
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	"prankster": {
		//Edited
		shortDesc: "This Pokemon's Status moves have priority lowered by 1",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.category === 'Status') {
				return priority - 1;
			}
		},
		id: "prankster",
		name: "Prankster",
		rating: 4,
		num: 158,
	},
	"pressure": {
		//Edited
		desc: "If this Pokemon is the target of an opposing Pokemon's move, that move don't lose PP.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move don't lose PP.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP: function (target, source) {
			if (target.side === source.side) return;
			return -1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 2,
		num: 46,
	},
	"primordialsea": {
		//Edited
		desc: "On switch-in, the weather becomes clear.",
		shortDesc: "On switch-in, rain stops until this Ability is not active in battle.",
		onStart: function (source) {
			this.clearWeather();
		},
		onAnySetWeather: function (target, source, weather) {
		    return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('primordialsea')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "primordialsea",
		name: "Primordial Sea",
		rating: 5,
		num: 189,
	},
	"prismarmor": {
		//Edited
		desc: "This Pokemon receives 4/3 damage from supereffective attacks. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon receives 4/3 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(4/3);
			}
		},
		isUnbreakable: true,
		id: "prismarmor",
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	"protean": {
		//Edited
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect.",
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!target.hp) return;
			let type = move.type;
			if (target.isActive && move.effectType === 'Move' && move.category !== 'Status' && type !== '???' && !target.hasType(type)) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const decision = this.willMove(target);
					if (decision && decision.move.id === 'curse') {
						decision.targetLoc = -1;
					}
				}
			}
		},
		id: "protean",
		name: "Protean",
		rating: 4,
		num: 168,
	},
	"psychicsurge": {
		//Edited
		shortDesc: "On switch-in, this Pokemon clears Terrains.",
		onStart: function (source) {
			this.clearTerrain();
		},
		id: "psychicsurge",
		name: "Psychic Surge",
		rating: 4,
		num: 227,
	},
	"purepower": {
		//Edited
		shortDesc: "This Pokemon's Attack is halved.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(0.5);
		},
		id: "purepower",
		name: "Pure Power",
		rating: 5,
		num: 74,
	},
	"queenlymajesty": {
		//Edited
		desc: "While this Pokemon is active, priority moves from opposing Pokemon targeted at allies have double power.",
		shortDesc: "While this Pokemon is active, allies weaks to opposing priority moves.",
		onFoeTryMove: function (target, source, effect) {
			if ((source.side === this.effectData.target.side || effect.id === 'perishsong') && effect.priority > 0.1 && effect.target !== 'foeSide') {
				this.add('cant', this.effectData.target, 'ability: Queenly Majesty', effect, '[of] ' + target);
				effect.basePower*=2;
			}
		},
		id: "queenlymajesty",
		name: "Queenly Majesty",
		rating: 3.5,
		num: 214,
	},
	"quickfeet": {
		//Edited
		desc: "If this Pokemon has a major status condition, its Speed is multiplied by 2/3;",
		shortDesc: "If this Pokemon is statused, its Speed is 2/3.",
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2/3);
			}
		},
		id: "quickfeet",
		name: "Quick Feet",
		rating: 2.5,
		num: 95,
	},
	"raindish": {
		//Edited
		desc: "If Rain Dance is active, this Pokemon loses 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Rain Dance is active, this Pokemon loses 1/16 of its max HP each turn.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.damage(target.maxhp / 16);
			}
		},
		id: "raindish",
		name: "Rain Dish",
		rating: 1.5,
		num: 44,
	},
	"rattled": {
		//Edited
		desc: "This Pokemon's Speed is lowered by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		shortDesc: "This Pokemon's Speed is lowered 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
				this.boost({spe:-1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	"receiver": {
		//Edited
		desc: "This Pokemon copies the Ability of an foes that faints. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		onFoeFaint: function (target) {
			if (!this.effectData.target.hp) return;
			let ability = this.getAbility(target.ability);
			let bannedAbilities = {comatose:1, flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, stancechange:1, trace:1, wonderguard:1, zenmode:1};
			if (bannedAbilities[target.ability]) return;
			this.add('-ability', this.effectData.target, ability, '[from] ability: Receiver', '[of] ' + target);
			this.effectData.target.setAbility(ability);
		},
		id: "receiver",
		name: "Receiver",
		rating: 0,
		num: 222,
	},
	"reckless": {
		//Edited
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 5/6. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 5/6 power; not Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.recoil || move.hasCustomRecoil) {
				this.debug('Reckless boost');
				return this.chainModify([0x1000, 0x1333]);
			}
		},
		id: "reckless",
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	"refrigerate": {
		//Edited
		desc: "This Pokemon's Ice-type moves become Normal-type moves and have their power multiplied by 5/6. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Ice-type moves become Normal type and have 5/6 power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Ice' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Normal';
				move.refrigerateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.refrigerateBoosted) return this.chainModify([0x1000, 0x1333]);
		},
		id: "refrigerate",
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	"regenerator": {
		//Edited
		shortDesc: "This Pokemon loses 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut: function (pokemon) {
			pokemon.damage(pokemon.maxhp / 3);
		},
		id: "regenerator",
		name: "Regenerator",
		rating: 4,
		num: 144,
	},
	"rivalry": {
		//Edited
		desc: "This Pokemon's attacks have their power multiplied by 4/5 against targets of the same gender or multiplied by 4/3 against targets of the opposite gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 4/5 on same gender targets; 4/3x on opposite gender.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(4/5);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(4/3);
				}
			}
		},
		id: "rivalry",
		name: "Rivalry",
		rating: 0.5,
		num: 79,
	},
	"rkssystem": {
		//wontBeEdited
		shortDesc: "If this Pokemon is a Silvally, its type changes to match its held Memory.",
		// RKS System's type-changing itself is implemented in statuses.js
		id: "rkssystem",
		name: "RKS System",
		rating: 4,
		num: 225,
	},
	"rockhead": {
		//Edited
		desc: "This Pokemon takes double recoil damage besides Struggle, Life Orb, and crash damage.",
		shortDesc: "This Pokemon takes double recoil damage besides Struggle/Life Orb/crash damage.",
		onDamage: function (damage, target, source, effect) {
			if (effect.id === 'recoil' && this.activeMove.id !== 'struggle') damage*=2;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 2.5,
		num: 69,
	},
	"roughskin": {
		//Edited
		desc: "Pokemon making contact with this Pokemon gains 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon gains 1/8 of their max HP.",
		onAfterDamageOrder: 1,
		onAfterDamage: function (damage, target, source, move) {
			if (source && source !== target && move && move.flags['contact']) {
				this.heal(source.maxhp / 8, source, target);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: 24,
	},
	"runaway": {
		//wontBeEdited
		shortDesc: "No competitive use.",
		id: "runaway",
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	"sandforce": {
		//Edited
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 10/13.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 10/13 in Sandstorm.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x1000, 0x14CD]);
				}
			}
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	"sandrush": {
		//Edited
		desc: "If Sandstorm is active, this Pokemon's Speed is halved.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is halved;",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('sandstorm')) {
				return this.chainModify(0.5);
			}
		},
		id: "sandrush",
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	"sandstream": {
		//Edited
		shortDesc: "On switch-in, this Pokemon breaks Sandstorm.",
		onStart: function (source) {
			if(this.isWeather('sandstorm')){
			this.clearWeather();
			}
		},
		id: "sandstream",
		name: "Sand Stream",
		rating: 4.5,
		num: 45,
	},
	"sandveil": {
		//Edited
		desc: "If Sandstorm is active, this Pokemon's evasiveness is multiplied by 4/5.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasiveness is 4/5",
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 5/4;
			}
		},
		id: "sandveil",
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	"sapsipper": {
		//Edited
		desc: "This Pokemon is weak to Grass-type moves and lowers its Attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is lowers 1 stage if hit by a Grass move; Grass weak.",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({atk:-1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Sap Sipper');
				}
				move.basePower*=2;
			}
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Grass') {
				this.boost({atk:-1}, this.effectData.target);
			}
		},
		id: "sapsipper",
		name: "Sap Sipper",
		rating: 3.5,
		num: 157,
	},
	"schooling": {
		//wontBeEdited
		desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form.",
		shortDesc: "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
					this.add('-formechange', pokemon, 'Wishiwashi-School', '[from] ability: Schooling');
				}
			} else {
				if (pokemon.template.speciesid === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
					this.add('-formechange', pokemon, 'Wishiwashi', '[from] ability: Schooling');
				}
			}
		},
		id: "schooling",
		name: "Schooling",
		rating: 3,
		num: 208,
	},
	"scrappy": {
		//willBeEdited
		shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onImmunity: function (type, pokemon) {
			return true;
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	"serenegrace": {
		//Edited
		shortDesc: "This Pokemon's moves have their secondary effect chance halved.",
		onModifyMovePriority: -2,
		onModifyMove: function (move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance /= 2;
				}
			}
		},
		id: "serenegrace",
		name: "Serene Grace",
		rating: 4,
		num: 32,
	},
	"shadowshield": {
		//Edited
		desc: "If this Pokemon is at full HP, damage taken from attacks is doubled. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is doubled.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(2);
			}
		},
		isUnbreakable: true,
		id: "shadowshield",
		name: "Shadow Shield",
		rating: 4,
		num: 231,
	},
	"shadowtag": {
		//Edited
		desc: "Forces switch foes pokemons.",
		shortDesc: "Forces switch foes pokemons.",
		onResidual: function (pokemon){
			let foeActive = pokemon.side.foe.active;
			for(let i in foeActive){
						foeActive[i].forceSwitchFlag = true;
				}
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: 23,
	},
	"shedskin": {
		//Edited
		desc: "This Pokemon has a 33% chance to get random major status condition at the end of each turn.",
		shortDesc: "This Pokemon has a 33% chance to get random status at the end of each turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp && !pokemon.status && this.random(3) === 0) {
					let r=this.random(6);
					if(r>5)pokemon.trySetStatus('frz');
					else if(r>4)pokemon.trySetStatus('brn');
					else if(r>3)pokemon.trySetStatus('par');
					else if(r>2)pokemon.trySetStatus('slp');
					else if(r>1)pokemon.trySetStatus('psn');
					else pokemon.trySetStatus('tox');
			}
		},
		id: "shedskin",
		name: "Shed Skin",
		rating: 3.5,
		num: 61,
	},
	"sheerforce": {
		//Edited
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 10/13, but the secondary effects chance doubled.",
		shortDesc: "This Pokemon's attacks with secondary effects have 10/13 power; the secondary effects chance doubled.",
		onModifyMove: function (move, pokemon) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
				move.hasSheerForce=true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x1000, 0x14CD]);
		},
		id: "sheerforce",
		name: "Sheer Force",
		rating: 4,
		num: 125,
	},
	"shellarmor": {
		//Edited
		shortDesc: "This Pokemon will always be struck by a critical hit.",
		onCriticalHit: true,
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			move.willCrit=true;
		},
		id: "shellarmor",
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	"shielddust": {
		//Edited
		shortDesc: "This Pokemon has double chance of the secondary effect of another Pokemon's attack.",
		onTryHit: function (target, source, move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 2;
				}
			}
		},
		id: "shielddust",
		name: "Shield Dust",
		rating: 2.5,
		num: 19,
	},
	"shieldsdown": {
		//wontBeEdited
		desc: "If this Pokemon is a Minior, it changes to its Core forme if it has 1/2 or less of its maximum HP, and changes to Meteor Form if it has more than 1/2 its maximum HP. This check is done on switch-in and at the end of each turn. While in its Meteor Form, it cannot become affected by major status conditions. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "If Minior, switch-in/end of turn it changes to Core at 1/2 max HP or less, else Meteor.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
					this.add('-formechange', pokemon, pokemon.set.species, '[from] ability: Shields Down');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.template.speciesid === 'minior') {
					pokemon.formeChange('Minior-Meteor');
					this.add('-formechange', pokemon, 'Minior-Meteor', '[msg]', '[from] ability: Shields Down');
				}
			} else {
				if (pokemon.template.speciesid !== 'minior') {
					pokemon.formeChange(pokemon.set.species);
					this.add('-formechange', pokemon, pokemon.set.species, '[msg]', '[from] ability: Shields Down');
				}
			}
		},
		onUpdate: function(pokemon){
			if (target.template.speciesid !== 'miniormeteor' || target.transformed) return;
			let r=this.random(6);
			if(r>5)pokemon.trySetStatus('frz');
			else if(r>4)pokemon.trySetStatus('brn');
			else if(r>3)pokemon.trySetStatus('par');
			else if(r>2)pokemon.trySetStatus('slp');
			else if(r>1)pokemon.trySetStatus('psn');
			else pokemon.trySetStatus('tox');
		},
		isUnbreakable: true,
		id: "shieldsdown",
		name: "Shields Down",
		rating: 3,
		num: 197,
	},
	"simple": {
		//Edited
		shortDesc: "When this Pokemon's stat stages are raised or lowered, the effect is halved instead.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				boost[i] /= 2;
			}
		},
		id: "simple",
		name: "Simple",
		rating: 4,
		num: 86,
	},
	"skilllink": {
		//Edited
		shortDesc: "This Pokemon's multi-hit attacks always hit the minimum number of times.",
		onModifyMove: function (move) {
			if (move.multihit && move.multihit.length) {
				move.multihit = move.multihit[0];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		id: "skilllink",
		name: "Skill Link",
		rating: 4,
		num: 92,
	},
	"slowstart": {
		//Edited
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are doubled for 5 turns.",
		onStart: function (pokemon) {
			pokemon.addVolatile('slowstart');
		},
		onEnd: function (pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		effect: {
			duration: 5,
			onStart: function (target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk: function (atk, pokemon) {
				return this.chainModify(2);
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(2);
			},
			onEnd: function (target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		id: "slowstart",
		name: "Slow Start",
		rating: -2,
		num: 112,
	},
	"slushrush": {
		//Edited
		shortDesc: "If Hail is active, this Pokemon's Speed is halved.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather('hail')) {
				return this.chainModify(0.5);
			}
		},
		id: "slushrush",
		name: "Slush Rush",
		rating: 2.5,
		num: 202,
	},
	"sniper": {
		//Edited
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is multiplied by 2/3.",
		onModifyDamage: function (damage, source, target, move) {
			if (move.crit) {
				this.debug('Sniper boost');
				return this.chainModify(2/3);
			}
		},
		id: "sniper",
		name: "Sniper",
		rating: 1,
		num: 97,
	},
	"snowcloak": {
			//Edited
		desc: "If Hail is active, this Pokemon's evasiveness is multiplied by 4/5.",
		shortDesc: "If Hail is active, this Pokemon's evasiveness is 4/5x;",
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.isWeather('hail')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 5/4;
			}
		},
		id: "snowcloak",
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	"snowwarning": {
		//Edited
		shortDesc: "On switch-in, this Pokemon disables Hail.",
		onStart: function (source) {
			if(this.isWeather('hail')){
			this.clearWeather();
			}
		},
		id: "snowwarning",
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	"solarpower": {
		//Edited
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 2/3 and it gains 1/8 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 2/3; gains 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA: function (spa, pokemon) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return this.chainModify(2/3);
			}
		},
		onWeather: function (target, source, effect) {
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.heal(target.maxhp / 8, target, target);
			}
		},
		id: "solarpower",
		name: "Solar Power",
		rating: 1.5,
		num: 94,
	},
	"solidrock": {
		//Edited
		shortDesc: "This Pokemon receives 4/3 damage from supereffective attacks.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(4/3);
			}
		},
		id: "solidrock",
		name: "Solid Rock",
		rating: 3,
		num: 116,
	},
	"soulheart": {
		//Edited
		desc: "This Pokemon's Special Attack is lowered by 1 stage when another Pokemon faints.",
		shortDesc: "This Pokemon's Sp. Atk is lowered by 1 stage when another Pokemon faints.",
		onAnyFaint: function () {
			this.boost({spa:-1}, this.effectData.target);
		},
		id: "soulheart",
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	"soundproof": {
		//Edited
		shortDesc: "This Pokemon is weak to sound-based moves.",
		onTryHit: function (target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', target, '[msg]', '[from] ability: Soundproof');
				move.basePower*=2;
			}
		},
		id: "soundproof",
		name: "Soundproof",
		rating: 2,
		num: 43,
	},
	"speedboost": {
		//Edited
		desc: "This Pokemon's Speed is lowered by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Speed is lowered 1 stage at the end of each full turn on the field.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.activeTurns) {
				this.boost({spe:-1});
			}
		},
		id: "speedboost",
		name: "Speed Boost",
		rating: 4.5,
		num: 3,
	},
	"stakeout": {
		//Edited
		shortDesc: "This Pokemon's attacking stat is halved against a target that switched in this turn.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(0.5);
			}
		},
		id: "stakeout",
		name: "Stakeout",
		rating: 2.5,
		num: 198,
	},
	"stall": {
		//Edited
		shortDesc: "This Pokemon moves first among Pokemon using the same or greater priority moves.",
		onModifyPriority: function (priority) {
			return Math.round(priority) + 0.1;
		},
		id: "stall",
		name: "Stall",
		rating: 4,
		num: 100,
	},
	"stamina": {
		//Edited
		shortDesc: "This Pokemon's Defense is lowered by 1 stage after it is damaged by a move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && effect.id !== 'confused') {
				this.boost({def:-1});
			}
		},
		id: "stamina",
		name: "Stamina",
		rating: 3,
		num: 192,
	},
	"stancechange": {
		//wontBeEditedEdited
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before attempting to use an attacking move, and changes to Shield Forme before attempting to use King's Shield.",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.",
		onBeforeMovePriority: 0.5,
		onBeforeMove: function (attacker, defender, move) {
			if (attacker.template.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			let targetSpecies = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.template.species !== targetSpecies && attacker.formeChange(targetSpecies)) {
				this.add('-formechange', attacker, targetSpecies, '[from] ability: Stance Change');
			}
		},
		id: "stancechange",
		name: "Stance Change",
		rating: 5,
		num: 176,
	},
	"static": {
		//Edited
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be cured from paralysis.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				if (this.random(10) < 3) {
					if(source.status=='par'){
						source.cureStatus();
					}
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: 9,
	},
	"steadfast": {
		//Edited
		shortDesc: "If this Pokemon flinches, its Speed is lowered by 1 stage.",
		onFlinch: function (pokemon) {
			this.boost({spe: -1});
		},
		id: "steadfast",
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	"steelworker": {
		//Edited
		shortDesc: "This Pokemon's attacking stat is multiplied by 2/3 while using a Steel-type attack.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(2/3);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(2/3);
			}
		},
		id: "steelworker",
		name: "Steelworker",
		rating: 3,
		num: 200,
	},
	"stench": {
		//Edited
		shortDesc: "This Pokemon's attacks with a chance to flinch have a 10% less chance to flinch.",
		onModifyMove: function (move) {
			if (move.category !== "Status"&&move.secondaries) {
				if(move.secondaries.volatileStatus=='flinch'){
					move.secondaries.chance-=10;
				}
			}
		},
		id: "stench",
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	"stickyhold": {
		//Edited
		shortDesc: "This Pokemon always lose its held item due to another Pokemon's attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				target.takeItem();
			}
		},
		id: "stickyhold",
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	"stormdrain": {
		//Edited
		desc: "This Pokemon is weak to Water-type moves and lowers its Special Attack by 1 stage when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move.",
		shortDesc: "This Pokemon weak Water moves to itself to lowers Sp. Atk by 1; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa:-1})) {
					this.add('-immune', target, '[msg]', '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget: function (target, source, source2, move) {
			if (move.type !== 'Water' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				if (this.effectData.target !== target) {
					this.add('-activate', this.effectData.target, 'ability: Storm Drain');
				}
				return this.effectData.target;
			}
		},
		onFoeBasePower: function (basePower, attacker, defender, move) {
			if (this.effectData.target !== defender) return;
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		id: "stormdrain",
		name: "Storm Drain",
		rating: 3.5,
		num: 114,
	},
	"strongjaw": {
		//Edited
		desc: "This Pokemon's bite-based attacks have their power multiplied by 2/3.",
		shortDesc: "This Pokemon's bite-based attacks have 2/3x power. Bug Bite is not boosted.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(2/3);
			}
		},
		id: "strongjaw",
		name: "Strong Jaw",
		rating: 3,
		num: 173,
	},
	"sturdy": {
		//Edited
		desc: "If this Pokemon is at full HP, it don't survives one hit if remains 1 HP. OHKO moves success when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it don't survives one hit if remains 1 HP. Weak to OHKO.",
		onTryHit: function (pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]', '[from] ability: Sturdy');
				return true;
			}
		},
		onDamagePriority: -100,
		onDamage: function (damage, target, source, effect) {
			if (target.hp === target.maxhp && damage == target.maxhp-1 && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				this.damage(1);
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 3,
		num: 5,
	},
	"suctioncups": {
		//Edited
		shortDesc: "This Pokemon always forced to switch out by another Pokemon's attack.",
		onDragOutPriority: 1,
		onAfterDamage: function (damage, target, source, effect)  {
			if (effect && effect.effectType === 'Move') {
				target.forceSwitchFlag=true;
			}
		},
		id: "suctioncups",
		name: "Suction Cups",
		rating: 1.5,
		num: 21,
	},
	"superluck": {
		//Edited
		shortDesc: "This Pokemon's critical hit ratio is lowered by 1 stage.",
		onModifyCritRatio: function (critRatio) {
			return critRatio - 1;
		},
		id: "superluck",
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	"surgesurfer": {
		//Edited
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is halved.",
		onModifySpe: function (spe) {
			if (this.isTerrain('electricterrain')) {
				return this.chainModify(0.5);
			}
		},
		id: "surgesurfer",
		name: "Surge Surfer",
		rating: 2,
		num: 207,
	},
	"swarm": {
		//Edited
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 2/3 while using a Bug-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Bug attacks do 2/3 damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(2/3);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(2/3);
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	"sweetveil": {
		//Edited
		shortDesc: "This Pokemon and its allies always fall asleep.",
		id: "sweetveil",
		name: "Sweet Veil",
		onUpdate: function (pokemon) {
			if (status.id != 'slp') {
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				 let active=pokemon.side.active;
				 for(let i in active){
					 if(!active[i].status){
						let r=this.random(6);
						active[i].trySetStatus('slp');
					 }
				 }
			}
		},
		onAllySetStatus: function (status, target, source, effect) {
			if (status.id != 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		onAllyTryAddVolatile: function (status, target) {
			if (status.id != 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				this.add('-activate', this.effectData.target, 'ability: Sweet Veil', '[of] ' + target);
				return null;
			}
		},
		rating: 2,
		num: 175,
	},
	"swiftswim": {
		//Edited
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is halved.",
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(0.5);
			}
		},
		id: "swiftswim",
		name: "Swift Swim",
		rating: 3,
		num: 33,
	},
	"symbiosis": {
		//Edited
		desc: "If an foe uses its item, this Pokemon gives its item to that foes immediately. Does not activate if the ally's item was stolen or knocked off.",
		shortDesc: "If an foe uses its item, this Pokemon gives its item to that foe immediately.",
		onFoeAfterUseItem: function (item, pokemon) {
			let sourceItem = this.effectData.target.getItem();
			if (!sourceItem) return;
			if (!this.singleEvent('TakeItem', item, this.effectData.target.itemData, this.effectData.target, pokemon, this.effectData, item)) return;
			sourceItem = this.effectData.target.takeItem();
			if (!sourceItem) {
				return;
			}
			if (pokemon.setItem(sourceItem)) {
				this.add('-activate', this.effectData.target, 'ability: Symbiosis', sourceItem, '[of] ' + pokemon);
			}
		},
		id: "symbiosis",
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	"synchronize": {
		//Edited
		desc: "If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon, that Pokemon is cured from status.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it is cured from status.",
		onAfterSetStatus: function (status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			source.clearStatus();
		},
		id: "synchronize",
		name: "Synchronize",
		rating: 2,
		num: 28,
	},
	"tangledfeet": {
		//Edited
		shortDesc: "This Pokemon's evasiveness is halved as long as it is confused.",
		onModifyAccuracy: function (accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target && target.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return accuracy * 2;
			}
		},
		id: "tangledfeet",
		name: "Tangled Feet",
		rating: 1,
		num: 77,
	},
	"tanglinghair": {
		//Edited
		shortDesc: "Pokemon making contact with this Pokemon have their Speed raised by 1 stage.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.flags['contact']) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({spe: 1}, source, target, null, null, true);
			}
		},
		id: "tanglinghair",
		name: "Tangling Hair",
		rating: 2.5,
		num: 221,
	},
	"technician": {
		//Edited
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 2/3. Does affect Struggle.",
		shortDesc: "This Pokemon's moves of 60 power or less have 2/3x power. Includes Struggle.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(2/3);
			}
		},
		id: "technician",
		name: "Technician",
		rating: 4,
		num: 101,
	},
	"telepathy": {
	//Edited
		shortDesc: "This Pokemon takes double damage from attacks made by its allies.",
		onTryHit: function (target, source, move) {
			if (target !== source && target.side === source.side && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				this.chainModify(2);
			}
		},
		id: "telepathy",
		name: "Telepathy",
		rating: 0,
		num: 140,
	},
	"teravolt": {
		//willBeEdited
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onModifyMove: function (move) {
			move.ignoreAbility = true;
		},
		id: "teravolt",
		name: "Teravolt",
		rating: 3.5,
		num: 164,
	},
	"thickfat": {
		//Edited
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's attacking stat is doubled when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Ice-type moves against this Pokemon deal damage with a doubled attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(2);
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	"tintedlens": {
		//Edited
		shortDesc: "This Pokemon's attacks that are not very effective on a target deal halved damage.",
		onModifyDamage: function (damage, source, target, move) {
			if (move.typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(0.5);
			}
		},
		id: "tintedlens",
		name: "Tinted Lens",
		rating: 3.5,
		num: 110,
	},
	"torrent": {
		//Edited
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 2/3 while using a Water-type attack.",
		shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Water attacks do 2/3 damage.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(2/3);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(2/3);
			}
		},
		id: "torrent",
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	"toxicboost": {
		//Edited
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 2/3.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 2/3 power.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(2/3);
			}
		},
		id: "toxicboost",
		name: "Toxic Boost",
		rating: 3,
		num: 137,
	},
	"toughclaws": {
		//Edited
		shortDesc: "This Pokemon's contact moves have their power multiplied by 10/13.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([0x1000, 0x14CD]);
			}
		},
		id: "toughclaws",
		name: "Tough Claws",
		rating: 3.5,
		num: 181,
	},
	"trace": {
		//Edited
		desc: "On switch-in, this Pokemon gives this ability to random adjacent opposing Pokemon.",
		shortDesc: "On switch-in gives this ability to random adjacent opposing Pokemon.",
		onUpdate: function (pokemon) {
			if (!pokemon.isStarted) return;
			let possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				let ability = this.getAbility(pokemon.ability);
				this.add('-ability', target, ability, '[from] ability: Trace', '[of] ' + pokemon);
				target.setAbility(ability);
				return;
			}
		},
		id: "trace",
		name: "Trace",
		rating: 3,
		num: 36,
	},
	"triage": {
		//Edited
		shortDesc: "This Pokemon's healing moves have their priority decreased by 3.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.flags['heal']) return priority - 3;
		},
		id: "triage",
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	"truant": {
		//Edited
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect multi-hit moves or moves that have multiple targets.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.",
		onPrepareHit: function (source, target, move) {
			if (['iceball', 'rollout'].includes(move.id)) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit && !move.isZ) {
				move.multihit = 2;
				move.hasParentalBond = true;
				move.hit = 0;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.hasParentalBond && ++move.hit > 1) return this.chainModify(0.25);
		},
		onSourceModifySecondaries: function (secondaries, target, source, move) {
			if (move.hasParentalBond && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		id: "truant",
		name: "Truant",
		rating: -2,
		num: 54,
	},
	"turboblaze": {
		//willBeEdited
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onModifyMove: function (move) {
			move.ignoreAbility = true;
		},
		id: "turboblaze",
		name: "Turboblaze",
		rating: 3.5,
		num: 163,
	},
	"unaware": {
		//Edited
		desc: "This Pokemon doubles other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon doubles other Pokemon's stat stages when taking or doing damage.",
		id: "unaware",
		name: "Unaware",
		onAnyModifyBoost: function (boosts, target) {
			let source = this.effectData.target;
			if (source === target) return;
			if (source === this.activePokemon && target === this.activeTarget) {
				boosts['def'] *= 2;
				boosts['spd'] *= 2;
				boosts['evasion'] *= 2;
			}
			if (target === this.activePokemon && source === this.activeTarget) {
				boosts['atk'] *= 2;
				boosts['spa'] *= 2;
				boosts['accuracy'] *= 2;
			}
		},
		rating: 3,
		num: 109,
	},
	"unburden": {
		//Edited
		desc: "If this Pokemon loses its held item for any reason, its Speed is halved. This boost is lost if it switches out or gains a new item or Ability.",
		shortDesc: "Speed is halved on held item loss; boost is lost if it switches, gets new item/Ability.",
		onAfterUseItem: function (item, pokemon) {
			if (pokemon !== this.effectData.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem: function (item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd: function (pokemon) {
			pokemon.removeVolatile('unburden');
		},
		effect: {
			onModifySpe: function (spe, pokemon) {
				if (!pokemon.item) {
					return this.chainModify(0.5);
				}
			},
		},
		id: "unburden",
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},
	"unnerve": {
		//Edited
		shortDesc: "While this Pokemon is active, it force opposing Pokemon to use their Berries.",
		onPreStart: function (pokemon) {
			this.add('-ability', pokemon, 'Unnerve', pokemon.side.foe);
		},
		onUpdate: function(pokemon){
			let active=pokemon.side.foe.active;
			for(let i in active){
				active[i].ateBerry = true;
			}
		},
		id: "unnerve",
		name: "Unnerve",
		rating: 1.5,
		num: 127,
	},
	"victorystar": {
		//Edited
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 10/11.",
		onAllyModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 10/11;
			}
		},
		id: "victorystar",
		name: "Victory Star",
		rating: 3,
		num: 162,
	},
	"vitalspirit": {
		//Edited
		desc: "This Pokemon cannot be statused, and is considered to be asleep. Moongeist Beam, Sunsteel Strike, and the Abilities Mold Breaker, Teravolt, and Turboblaze cannot ignore this Ability.",
		shortDesc: "This Pokemon cannot be statused, and is considered to be asleep.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Comatose');
		},
		onSetStatus: function (status, target, source, effect) {
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Comatose');
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		isUnbreakable: true,
		id: "vitalspirit",
		name: "Vital Spirit",
		rating: 2,
		num: 72,
	},
	"voltabsorb": {
		//Edited
		desc: "This Pokemon is weak to Electric-type moves and loses 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon loses 1/4 of its max HP when hit by Electric moves;",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.damage(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Volt Absorb');
				}
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	"waterabsorb": {
		//Edited
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.damage(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
			}
		},
		id: "waterabsorb",
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	"waterbubble": {
		//Edited
		esc: "This Pokemon's attacking stat is halved while using a Water-type attack. If a Pokemon uses a Fire-type attack against this Pokemon, that Pokemon's attacking stat is doubled when calculating the damage to this Pokemon. This Pokemon always burned..",
		shortDesc: "This Pokemon's Water power is 0.5x; it always burned; Fire power against it is doubled.",
		onModifyAtkPriority: 5,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		onUpdate: function (pokemon) {
				pokemon.trySetStatus('brn');
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn' && status.id !== 'brn'){
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			return false;}
		},
		id: "waterbubble",
		name: "Water Bubble",
		rating: 4,
		num: 199,
	},
	"watercompaction": {
		//Edited
		shortDesc: "This Pokemon's Defense is lowered 2 stages after it is damaged by a Water-type move.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && effect.type === 'Water') {
				this.boost({def:-2});
			}
		},
		id: "watercompaction",
		name: "Water Compaction",
		rating: 2,
		num: 195,
	},
	"waterveil": {
		//Edited
		shortDesc: "This Pokemon will always be burned.",
		onUpdate: function (pokemon) {
				pokemon.trySetStatus('brn');
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'brn' && status.id !== 'brn'){
			this.add('-immune', target, '[msg]', '[from] ability: Immunity');
			return false;}
		},
		id: "waterveil",
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	"weakarmor": {
		//Edited
		desc: "If a physical attack hits this Pokemon, its Defense is raised by 1 stage and its Speed is lowered by 2 stages.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is raised by 1, Speed is lowered by 2.",
		onAfterDamage: function (damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({def:1, spe:-2});
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	"whitesmoke": {
		//Edited
		shortDesc: "Doubles other Pokemon's lowering this Pokemon's stat stages.",
		onBoost: function (boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					boost[i]*=2;
					showMsg = true;
				}
			}
			if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] " + target);
		},
		id: "whitesmoke",
		name: "White Smoke",
		rating: 2,
		num: 73,
	},
	"wimpout": {
		//Edited
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it can't switch out. This effect applies after all hits from a multi-hit move; Sheer Force prevents it from activating if the move has a secondary effect. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage.",
		shortDesc: "This Pokemon can't switch out when it reaches 1/2 or less of its maximum HP.",
		onAfterMoveSecondary: function (target, source, move) {
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			if (target.hp <= target.maxhp / 2 && target.hp + move.totalDamage > target.maxhp / 2) {
				target.addVolatile('trapped', source, move, 'trapper');
			}
		},
		onAfterDamage: function (damage, target, source, effect) {
			if (!target.hp || effect.effectType === 'Move') return;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				 target.addVolatile('trapped', source, effect, 'trapper');
			}
		},
		id: "wimpout",
		name: "Wimp Out",
		rating: 2,
		num: 193,
	},
	"wonderguard": {
		//Edited
		shortDesc: "This Pokemon can only be damaged by not supereffective moves and direct damage.",
		onTryHit: function (target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return null;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) >= 0) {
				this.add('-immune', target, '[msg]', '[from] ability: Wonder Guard');
				return null;
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		id: "wonderguard",
		name: "Wonder Guard",
		rating: 5,
		num: 25,
	},
	"wonderskin": {
		//Edited
		desc: "All non-damaging moves that check accuracy have their accuracy changed to 100% when used on this Pokemon. This change is done before any other accuracy modifying effects.",
		shortDesc: "Status moves with accuracy checks are 100% accurate when used on this Pokemon.",
		onModifyAccuracyPriority: 10,
		onModifyAccuracy: function (accuracy, target, source, move) {
			if (move.category === 'Status' && typeof move.accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 100;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 2,
		num: 147,
	},
	"zenmode": {
		//willBeEdited
		desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode. If Darmanitan loses this Ability while in Zen Mode it reverts to Standard Mode immediately.",
		shortDesc: "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.",
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitan') {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.template.speciesid === 'darmanitanzen') {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd: function (pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.formeChange('Darmanitan')) {
				this.add('-formechange', pokemon, 'Darmanitan', '[silent]');
			}
		},
		effect: {
			onStart: function (pokemon) {
				if (pokemon.template.speciesid === 'darmanitanzen' || !pokemon.formeChange('Darmanitan-Zen')) return;
				this.add('-formechange', pokemon, 'Darmanitan-Zen', '[from] ability: Zen Mode');
			},
			onEnd: function (pokemon) {
				if (!pokemon.formeChange('Darmanitan')) return;
				this.add('-formechange', pokemon, 'Darmanitan', '[from] ability: Zen Mode');
			},
		},
		id: "zenmode",
		name: "Zen Mode",
		rating: -1,
		num: 161,
	},
};

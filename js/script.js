const categoryList = document.querySelector('#category');
const characterInput = document.querySelector('#characterInput');
const suggestionList = document.querySelector('#suggestions');
const displayBox = document.querySelector('.display-box');
const imgBox = document.querySelector('.charImgBox');
const overview = document.querySelector('.charOverview');
const introBox = document.querySelector('.charIntroBox');

function clearSuggestions() {
	suggestionList.innerHTML = '';
}

function clearCharInfo() {
	imgBox.innerHTML = '';
	overview.innerHTML = '';
	introBox.innerHTML = '';
}

// Allow user to search only when a category is selected
categoryList.addEventListener('change', async () => {
	characterInput.removeAttribute('disabled');
	characterInput.value = ''
	clearSuggestions();
});

// Handle which function to fire when input
characterInput.addEventListener('keyup', async () => {
	clearSuggestions();

	const charName = characterInput.value;
	if (charName.length < 1) {
		return;
	} else {
		const category = categoryList.value;
		switch (category) {
			case 'marvel':
				getMarvelChar(charName);
				break;
			case 'pokemon':
				getPokemanChar(charName);
				break;
			case 'harrypotter':
				getHarrypotterCharacter(charName);
			default:
				break;
		}
		return;
	}
});

async function getMarvelChar(name) {
	const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${name}&apikey=${key}`;
	const response = await fetch(url);
	const jsonData = await response.json();
	const results = jsonData.data.results;

	if (results.length == 0) {
		clearSuggestions();
		const listItem = document.createElement('li');
		listItem.innerText = 'No Characters Found';
		suggestionList.appendChild(listItem);
		return;
	}

	clearSuggestions();
	for (let i = 0; i < results.length && i < 10; i++) {
		const listItem = document.createElement('li');
		listItem.setAttribute('charId', results[i].id);
		listItem.innerText = `${results[i].name}`;
		listItem.setAttribute('onClick', `clickedMarvel(${results[i].id})`);
		suggestionList.appendChild(listItem);
	}
}

async function clickedMarvel(id) {
	clearSuggestions();
	clearCharInfo();

	const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${key}`;
	const response = await fetch(url);
	const jsonData = await response.json();
	const result = jsonData.data.results[0];

	// set display box color
    displayBox.style.background= 'rgba(0, 0, 0, 0.6)';

	// feed Image
	const charImg = document.createElement('img');
	charImg.src = `${result.thumbnail.path}.${result.thumbnail.extension}`;
	imgBox.appendChild(charImg);

	// feed Overview
	const name = document.createElement('p');
	name.classList.add('name');
	name.innerText = result.name;
	const charId = document.createElement('span');
	charId.classList.add('etc');
	charId.innerText = `ID: ${result.id}`;
	overview.appendChild(name);
	overview.appendChild(charId);

	// feed Intro
	const intro = document.createElement('p');
	intro.classList.add('intro');
	intro.innerHTML = result.description;
	introBox.appendChild(intro);
	document.querySelector('.intro').style.textAlign = 'justify';

	return;
}

async function getPokemanChar(name) {
	name = name.toLowerCase();
	const url = `https://pokeapi.co/api/v2/pokemon/${name}/`;
	const response = await fetch(url);
	const result = await response.json();

	if (result) {
		clearSuggestions();
		const listItem = document.createElement('li');
		listItem.setAttribute('charId', result.id);
		listItem.innerText = `${result.name} ${result.id}`;
		listItem.setAttribute('onClick', `clickedPokemon(${result.id})`);
		suggestionList.appendChild(listItem);
	} else {
		clearSuggestions();
		const listItem = document.createElement('li');
		listItem.innerText = 'No Characters Found';
		suggestionList.appendChild(listItem);
		return;
	}
}

async function clickedPokemon(id) {
	clearSuggestions();
	clearCharInfo();

	const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
	const response = await fetch(url);
	const result = await response.json();

	// set display box color
    displayBox.style.background= 'rgba(0, 0, 0, 0.6)';

	// feed Image
	const charImg = document.createElement('img');
	const imgSrc = result.sprites.other.home.front_default;
	if(imgSrc) {
		charImg.src = `${imgSrc}`;
	} else {
		charImg.src = result.sprites.front_default;
	}
	imgBox.appendChild(charImg);

	// feed Overview
	const name = document.createElement('p');
	name.classList.add('name');
	name.innerText = result.name;
	const charId = document.createElement('span');
	charId.classList.add('etc');
	charId.innerText = `ID: ${result.id}`;
	const hp = document.createElement('span');
	hp.classList.add('etc');
	hp.innerText = `HP: ${result.stats[0].base_stat}`;
	overview.appendChild(name);
	overview.appendChild(charId);
	overview.appendChild(hp);

	// feed Intro
	// abilities
	const abilitiesPara = document.createElement('p');
	const abilities = result.abilities;
	abilitiesPara.classList.add('intro');
	abilitiesPara.innerText = 'Abilities: '
	for (let i = 0; i < abilities.length && i < 6; i++) {
		if(i == abilities.length -1 || i == 5) {
			// no comma for last one
			abilitiesPara.innerText = abilitiesPara.innerText + abilities[i].ability.name;
		} else {
			abilitiesPara.innerText = abilitiesPara.innerText + abilities[i].ability.name + ', ';
		}
	}

	// forms
	const formsPara = document.createElement('p');
	const forms = result.forms;
	formsPara.classList.add('intro');
	formsPara.innerText = 'Forms: '
	for (let i = 0; i< forms.length && i < 6; i++) {
		if(i == forms.length -1 || i == 5) {
			// no comma for last one
			formsPara.innerText = formsPara.innerText + forms[i].name;
		} else {
			formsPara.innerText = formsPara.innerText + forms[i].name + ', ';
		}
	}

	// moves
	const movesPara = document.createElement('p');
	const moves = result.moves;
	movesPara.classList.add('intro');
	movesPara.innerText = 'Moves: '
	for (let i =0; i< moves.length && i < 6; i++) {
		if(i == moves.length -1 || i == 5) {
			// no comma for last one
			movesPara.innerText = movesPara.innerText + moves[i].move.name;
		} else {
			movesPara.innerText = movesPara.innerText + moves[i].move.name + ', ';
		}
	}

	introBox.appendChild(abilitiesPara);
	introBox.appendChild(formsPara);
	introBox.appendChild(movesPara)

	return;
}

async function getHarrypotterCharacter(name) {
	name = name.toLowerCase().replace(/ /g, '-');
	const url = `https://api.potterdb.com/v1/characters/${name}`;
	const response = await fetch(url);
	const result = await response.json();
	const data = result.data;

	if (data) {
		clearSuggestions();
		const listItem = document.createElement('li');
		listItem.setAttribute('charId', data.id);
		listItem.innerText = `${data.attributes.name}`;
		listItem.setAttribute(
			'onClick',
			`clickedHarry("${data.attributes.slug}")`
		);
		suggestionList.appendChild(listItem);
	} else {
		clearSuggestions();
		const listItem = document.createElement('li');
		listItem.innerText = 'No Characters Found';
		suggestionList.appendChild(listItem);
		return;
	}
}

async function clickedHarry(slug) {
	clearSuggestions();
	clearCharInfo();

	const url = `https://api.potterdb.com/v1/characters/${slug}`;
	const response = await fetch(url);
	const result = await response.json();
	const data = result.data;

	// set display box color
    displayBox.style.background= 'rgba(0, 0, 0, 0.6)';

	console.log(data);

	// feed Image
	const charImg = document.createElement('img');
	charImg.src = `${data.attributes.image}`;
	imgBox.appendChild(charImg);

	// feed Overview
	const name = document.createElement('p');
	name.classList.add('name');
	name.innerText = data.attributes.name;
	const species = document.createElement('span');
	species.classList.add('etc');
	species.innerText = `${data.attributes.species}`;
	overview.appendChild(name);
	overview.appendChild(species);
	if(data.attributes.gender) {
		const gender = document.createElement('span');
		gender.classList.add('etc');
		gender.innerText = `${data.attributes.gender}`;
		overview.appendChild(gender);
	}

	// feed Intro
	// titles
	const titlesPara = document.createElement('p');
	const titles = data.attributes.titles;
	titlesPara.classList.add('intro');
	titlesPara.innerText = 'Titles: '
	if(!titles) {
		titlesPara.innerText = titlesPara.innerText + 'none';
	} else {
		for (let i = 0; i < titles.length && i < 3; i++) {
			if(i == titles.length -1 || i == 2) {
				// no comma for last one
				titlesPara.innerText = titlesPara.innerText + titles[i];
			} else {
				titlesPara.innerText = titlesPara.innerText + titles[i] + ', ';
			}
		}
	}
	introBox.appendChild(titlesPara);

	// wands
	const wandsPara = document.createElement('p');
	const wands = data.attributes.wands;
	wandsPara.classList.add('intro');
	wandsPara.innerText = 'Wands: '
	if(!wands) {
		wandsPara.innerText = wandsPara.innerText + 'none';
	} else {
		for (let i = 0; i < wands.length && i < 6; i++) {
			if(i == wands.length -1 || i == 5) {
				// no comma for last one
				wandsPara.innerText = wandsPara.innerText + wands[i].split(', ')[1];
			} else {
				wandsPara.innerText = wandsPara.innerText + wands[i].split(', ')[1] + ', ';
			}
		}
	}
	introBox.appendChild(wandsPara);


}


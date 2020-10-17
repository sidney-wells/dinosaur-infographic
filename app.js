// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
let globalDinosObjs = [];
const getDinos = (async () => {
  const response = await fetch('./dino.json');
  const dinos = await response.json();
  const dinosObjs = await dinos.Dinos.map((dino) => {
    const { species, weight, height, diet, where, when, fact } = dino;
    const dinoObj = new Dino(species, weight, height, diet, where, when, fact);
    return dinoObj;
  });
  globalDinosObjs = dinosObjs;
})();

// Create Human Object
function Human(name, height, weight, diet) {
  this.species = 'Human';
  this.name = name;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
}

// Use IIFE to get human data from form
const getHumanData = () => {
  let formData = document.getElementById('dino-compare');
  let input = [];
  for (let i = 0; i < formData.length; i++) {
    input.push(formData.elements[i].value);
  }
  const feet = parseInt(input[1]);
  const inches = parseInt(input[2]);
  const height = feet * 12 + inches;
  return new Human(input[0], height, input[3], input[4]);
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareWeight = (dino, human) => {
  return `${human.name} weighs ${human.weight} and ${dino.species} weighs ${dino.weight}.`;
};

// Create Dino Compare Method 2
// NOTE: Height in JSON file.
const compareHeight = (dino, human) => {
  return `${dino.species} is ${dino.height} inches but ${human.name} is ${human.height} inches.`;
};

// Create Dino Compare Method 3
// NOTE: Diet in JSON file.
const compareDiet = (dino, human) => {
  return `${human.name} is a ${human.diet} while ${dino.species} is a ${dino.diet}.`;
};

// Helper Function to Shuffle Dino Array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// Helper Function to Get Random Comparison Function
function getComparisonFunction(num, dino, human) {
  switch (num) {
    case 0: {
      return compareWeight(dino, human);
    }
    case 1: {
      return compareHeight(dino, human);
    }
    case 2: {
      return compareDiet(dino, human);
    }
    default: {
      return dino.fact;
    }
  }
}

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', function () {
  console.log('globalDinos', globalDinosObjs);
  const form = document.getElementById('dino-compare');

  // Remove form from screen
  form.style.display = 'none';
  const human = getHumanData();
  const randomizedDinos = _.shuffle(globalDinosObjs);
  randomizedDinos.splice(4, 0, human);
  console.log('newDinos', randomizedDinos);

  // Generate Tiles for each Dino in Array
  randomizedDinos.forEach((dino) => {
    let gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    let title = document.createElement('h6');
    title.textContent = dino.species;
    let image = document.createElement('img');
    image.src = `images/${dino.species}.png`;
    if (dino.species != 'Human') {
      if (dino.species == 'Pigeon') {
        let fact = document.createElement('p');
        fact.innerHTML = dino.fact;
        gridItem.appendChild(fact);
      } else {
        const num = Math.floor(Math.random() * 3);
        let randomFact = getComparisonFunction(num, dino, human);
        let fact = document.createElement('p');
        fact.innerHTML = randomFact;
        gridItem.appendChild(fact);
      }
    }
    gridItem.appendChild(title);
    gridItem.appendChild(image);
    let gridFrag = document.createDocumentFragment();
    gridFrag.appendChild(gridItem);

    // Add tiles to DOM
    document.querySelector('#grid').appendChild(gridFrag);
  });
});

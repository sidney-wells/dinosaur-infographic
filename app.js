// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
  this.whenFact = function whenFact() {
    return `The ${this.species} was alive during ${this.when}`;
  };
  this.whereFact = function whereFact() {
    return `The ${this.species} lived in ${this.where}`;
  };
  this.aFact = function aFact() {
    return `${this.fact}`;
  };
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

// Dino.prototype.weightCompare = function(){
//   if (human.weight < this.weight + 20 && human.weight > this.weight - 20){
//       return `Close match! They average ${this.weight} pounds. But you probably wouldn't want to wrestle.`;
//   } else if (human.weight >= this.weight + 20){
//       const weightDifference = Number.parseFloat(human.weight / this.weight).toPrecision(2);
//       return `You're ${weightDifference} times larger than the ${this.species}. Still not a great pet idea.`;
//   } else {
//       const weightDifference = Number.parseFloat(this.weight/human.weight).toPrecision(2);
//       return `The ${this.species} is ${weightDifference} times larger than you. Don't get in the way.`;
//   }
// }

// Create Dino Compare Method 1 - Weight
const compareWeight = (dino, human) => {
  if (human.weight + 30 < dino.weight) {
    return `Oh no, ${human.name} would get crushed by a ${dino.species} in sumowrestling.`;
  } else if (human.weight - 20 > dino.weight) {
    return `Maybe ${human.name} could take on a ${dino.species} in sumowrestling.`;
  } else {
    return `${human.name} and ${dino.species} weight similar so they should be friends.`;
  }
};

// Create Dino Compare Method 2 - Height
const compareHeight = (dino, human) => {
  if (human.height + 8 < dino.height) {
    return `Ooof, ${dino.species} towers over ${human.name}.`;
  } else if (human.height - 20 > dino.height) {
    return `Even thought ${human.name} is way taller, height isn't everything.`;
  } else {
    return `Hm, ${human.name} and ${dino.species} are similar heights, maybe friends?`;
  }
};

// Create Dino Compare Method 3 - Diet
const compareDiet = (dino, human) => {
  if (human.diet == 'Omnivore' && dino.diet == 'omnivore') {
    return `Oops, ${human.name} and ${dino.species} may want to eat each other.`;
  } else if (dino.diet == 'carnivor' || dino.diet == 'omnivore') {
    return `${human.name} should be careful. The ${dino.species} will want to eat him.`;
  } else {
    return `Even if ${dino.species} may not eat humans, ${human.name} should be careful.`;
  }
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
    case 3: {
      return dino.whenFact();
    }
    case 4: {
      return dino.whereFact();
    }
    case 5: {
      return dino.aFact();
    }
    default: {
      return dino.fact;
    }
  }
}

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', function () {
  const form = document.getElementById('dino-compare');

  // Remove form from screen
  form.style.display = 'none';
  const human = getHumanData();
  const randomizedDinos = _.shuffle(globalDinosObjs);
  randomizedDinos.splice(4, 0, human);

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
        const num = Math.floor(Math.random() * 6);
        let randomFact = getComparisonFunction(num, dino, human);
        console.log('num', num);
        console.log('fact', randomFact);
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

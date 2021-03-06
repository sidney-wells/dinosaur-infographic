// Storage for dinosaur grid images
const S3_BUCKET = 'https://dinosaur-images.s3.us-east-2.amazonaws.com';

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
  let valid = true;
  let formData = document.getElementById('dino-compare');
  let input = [];

  for (let i = 0; i < formData.length; i++) {
    if (formData.elements[i].value === '') {
      alert('Please do not leave values blank');
      valid = false;
      break;
    } else {
      input.push(formData.elements[i].value);
    }
  }

  if (valid) {
    const feet = parseInt(input[1]);
    const inches = parseInt(input[2]);
    const height = feet * 12 + inches;
    const weight = parseInt(input[3]);

    if (feet < 0) {
      alert('Please input a feet value greater than 0.');
      valid = false;
    } else if ((feet === 0 && inches === 0) || inches < 0) {
      alert('Please input an inches value greater than 0.');
      valid = false;
    } else if (height < 0) {
      alert('Please input a height value greater than 0.');
      valid = false;
    } else if (weight < 0) {
      alert('Please input a weight value greater than 0.');
      valid = false;
    } else {
      return new Human(input[0], height, weight, input[4]);
    }
  }
};

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
    const form = document.getElementById('dino-compare');
    form.style.display = 'none';
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

// Helper Function to Create Tooltip
const createToolTip = (fact, span, dino, randomFact) => {
  let result = {};
  fact.addEventListener('mouseover', function () {
    span.style.visibility = 'visible';
  });
  fact.addEventListener('mouseout', function () {
    span.style.visibility = 'hidden';
  });
  span.className = 'tooltiptext';
  let species = document.createElement('span');
  let weight = document.createElement('span');
  let height = document.createElement('span');
  let diet = document.createElement('span');
  let where = document.createElement('span');
  let when = document.createElement('span');
  species.innerHTML = `Species: ${dino.species}`;
  weight.innerHTML = `<br> Weight: ${dino.weight} lbs`;
  height.innerHTML = `<br> Height: ${dino.height} inches`;
  diet.innerHTML = `<br> Diet: ${dino.diet}`;
  where.innerHTML = `<br> Where: ${dino.where}`;
  when.innerHTML = `<br> When: ${dino.when}`;
  span.appendChild(species);
  span.appendChild(weight);
  span.appendChild(height);
  span.appendChild(diet);
  span.appendChild(where);
  span.appendChild(when);
  fact.innerHTML = randomFact ? randomFact : dino.fact;
  result = { fact: fact, span: span };
  return result;
};

// Helper Function to Create Reset Button
const createResetButton = (button, formData, form) => {
  let result;
  button.id = 'resetBtn';
  button.textContent = 'Reset Form';
  button.addEventListener('click', function () {
    const grid = document.querySelector('#grid');
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.style.display = 'none';
    form.style.display = 'block';
    button.style.display = 'none';
    for (let i = 0; i < formData.length - 1; i++) {
      formData[i].value = '';
    }
  });
  result = button;
  return result;
};

// Display infographic and remove form
document.getElementById('btn').addEventListener('click', function () {
  let formData = document.getElementById('dino-compare');
  let grid = document.querySelector('#grid');
  const human = getHumanData();
  if (human) {
    const form = document.getElementById('dino-compare');
    form.style.display = 'none';
    grid.style.display = 'flex';
    const randomizedDinos = _.shuffle(globalDinosObjs);
    randomizedDinos.splice(4, 0, human);
    randomizedDinos.forEach((dino, i) => {
      let gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      let title = document.createElement('h4');
      title.textContent = dino.species;
      let image = document.createElement('img');
      if (dino.species === 'Tyrannosaurus Rex') {
        image.src = `${S3_BUCKET}/${'TyrannosaurusRex'.toLowerCase()}.png`;
      } else {
        image.src = `${S3_BUCKET}/${dino.species.toLowerCase()}.png`;
      }
      if (dino.species != 'Human') {
        if (dino.species == 'Pigeon') {
          let fact = document.createElement('p');
          fact.className = 'tooltip';
          let span = document.createElement('div');
          const result = createToolTip(fact, span, dino);
          gridItem.appendChild(result.fact);
          gridItem.appendChild(result.span);
        } else {
          const num = Math.floor(Math.random() * 6);
          let randomFact = getComparisonFunction(num, dino, human);
          let fact = document.createElement('p');
          fact.className = 'tooltip';
          let span = document.createElement('div');
          const result = createToolTip(fact, span, dino, randomFact);
          gridItem.appendChild(result.fact);
          gridItem.appendChild(result.span);
        }
      }
      gridItem.appendChild(title);
      gridItem.appendChild(image);
      let gridFrag = document.createDocumentFragment();
      gridFrag.appendChild(gridItem);
      document.querySelector('#grid').appendChild(gridFrag);
    });
    let button = document.createElement('button');
    const result = createResetButton(button, formData, form);
    document.querySelector('#footer').appendChild(result);
  }
});

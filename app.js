let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '9577aef4-7b41-4b51-8348-17c43f05a671';
let notFound = document.querySelector('.not_found');
let defResult = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');



searchBtn.addEventListener('click', function(e){
  e.preventDefault();


  // clear data
  audioBox.innerHTML = '';
  notFound.innerText = '';
  defResult.innerText = '';


  // Get input data
  let word = input.value;

  // call API get data
  if (word === '') {
    alert('Please enter a word :)')
    return;
  }

  getData(word);
})


async function getData(word) {
  loading.style.display = 'block';
  // Ajax call
  const response = await fetch(`https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
  const data = await response.json();
  console.log(data)

  // if empty result 
  if (!data.length) {
    loading.style.display = 'none';
    notFound.innerText = "Hmm, I can't figure out the meaning of this."
    return;
  }

  //If result is suggestions
  if (typeof data[0] === 'string') {
    loading.style.display = 'none';
    let heading = document.createElement('h3');
    heading.innerText = 'Did you mean?'
    notFound.appendChild(heading);
    data.forEach(element => {
       let suggestions = document.createElement('span');
       suggestions.classList.add('suggested');
       suggestions.innerText = element;
       notFound.appendChild(suggestions);
    })
    return;
  }


  // Result found
  loading.style.display = 'none';
  let definition = data[0].shortdef[0];
  defResult.innerText = definition;

  // Sound
  const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName) {
      renderSound(soundName)
    }
  console.log(data);
}


function renderSound(soundName) {
  // https://media.merriam-webster.com/soundc11
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  let aud = document.createElement('audio');
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}

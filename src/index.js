import SlimSelect from 'slim-select';
import { Notify } from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');
const catInfoDiv = document.querySelector('.cat-info');

const showLoader = () => {
  loader.style.display = 'block';
  breedSelect.style.display = 'none';
  catInfoDiv.style.display = 'none';
  errorElement.style.display = 'none';
};

const hideLoader = () => {
  loader.style.display = 'none';
  breedSelect.style.display = 'block';
  catInfoDiv.style.display = 'block';
};

const showError = () => {
  errorElement.style.display = 'block';
};

const populateBreedSelect = async () => {
  showLoader();
  try {
    const breeds = await fetchBreeds();
    breedSelect.innerHTML = breeds
      .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
      .join('');
    new SlimSelect({ select: '.breed-select' });
  } catch (error) {
    showError();
   Notify.failure('Failed to fetch breeds.');
  } finally {
    hideLoader();
  }
};

const displayCatInfo = async (breedId) => {
  showLoader();
  try {
    const [catInfo] = await fetchCatByBreed(breedId);
    catInfoDiv.innerHTML = `
      <img src="${catInfo.url}" alt="Cat Image">
      <h2>${catInfo.breeds[0].name}</h2>
      <p>${catInfo.breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${catInfo.breeds[0].temperament}</p>
    `;
  } catch (error) {
    showError();
    Notify.failure('Failed to fetch cat information.');
  } finally {
    hideLoader();
  }
};

breedSelect.addEventListener('change', (event) => {
  const breedId = event.target.value;
  if (breedId) {
    displayCatInfo(breedId);
  }
});

populateBreedSelect();

import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = refs.input.value.trim();
  if (name === '') {
    return (refs.list.innerHTML = ''), (refs.info.innerHTML = '');
  }
  fetchCountries(name)
    .then(countries => {
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      if (countries.length === 1) {
        refs.list.insertAdjacentHTML('beforeend', renderCountryList(countries));
        refs.info.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        refs.list.insertAdjacentHTML('beforeend', renderCountryList(countries));
      }
    })
    .catch(alertWrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
        <li class = "country-list_item">
            <img class = "list country-list_flag" src = "${flags.svg}" alt = "Flag of ${name.official}"width = 100px height = 60px>
            <h2 class = "country-list_name">${name.official}</h2>
            </li>
            `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class = "country-info_list">
            <li class = "country-info_item"><p><b>Capital: </b>${capital}</p></li>
            <li class = "country-info_item"><p><b>Population: </b>${population}</p></li>
            <li class = "country-info_item"><p><b>languages: </b>${Object.values(languages).join(
              ', ',
            )}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
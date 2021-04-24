import './css/styles.scss';

import apiService from './js/apiService';

import formTemplate from './templates/searchForm.hbs';
import listTemplate from './templates/imagesList.hbs';
import cardTemplate from './templates/imageCard.hbs';
import nextBtnTemplate from './templates/buttonLoadMore.hbs';

const element = document.body;

element.insertAdjacentHTML('beforeend', formTemplate());
const formRef = element.querySelector('#search-form');

element.insertAdjacentHTML('beforeend', listTemplate());
const listRef = element.querySelector('.gallery');

element.insertAdjacentHTML('beforeend', nextBtnTemplate());
const nextBtnRef = document.querySelector('#load-more');

const renderImages = images => {
  images.map(image => {
    listRef.insertAdjacentHTML('beforeend', cardTemplate(image));
  });
};

const getImages = async searchRequest => {
  console.log(searchRequest, '---search');
  try {
    const results = await apiService.searchImages(searchRequest);
    if (results.hits.length !== 0) {
      renderImages(results.hits);
      nextBtnRef.classList.remove('hidden');
    } else {
      //TODO add users notifications for errors
      nextBtnRef.classList.add('hidden');
      console.log('Not Found');
    }
  } catch (error) {
    // TODO add users notifications for errors
    console.log(error, '---error');
  } finally {
    // preloader.hide();
  }
};

formRef.addEventListener('submit', event => {
  event.preventDefault();
  const searchValue = event.target.elements['query'].value.trim();
  if (searchValue) {
    getImages(searchValue.replace(' ', '+'));
  }
});

{
  /* <state>: "fulfilled"
<value>: {…}
hits: Array(20) [ {…}, {…}, {…}, … ]
total: 19042
totalHits: 500 */
}

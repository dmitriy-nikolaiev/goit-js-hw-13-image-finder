import apiService from './utils/apiService.js';
import '../../css/images.scss';

import * as basicLightbox from 'basiclightbox';
import '../../../node_modules/basiclightbox/dist/basicLightbox.min.css';

import errorMsg from './utils/message.js';

import formTemplate from '../../templates/searchForm.hbs';
import listTemplate from '../../templates/imagesList.hbs';
import cardTemplate from '../../templates/imageCard.hbs';
import nextBtnTemplate from '../../templates/buttonLoadMore.hbs';

class Images {
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.searchQuery = '';
    this.currentPage = 1;
    this.totalPages = 0;
    this.perPage = 12;

    this.searchHandler = this.searchHandler.bind(this);
    this.nextPageHandler = this.nextPageHandler.bind(this);

    // this.init();
    this.element.insertAdjacentHTML('beforeend', formTemplate());
    const formRef = this.element.querySelector('#search-form');
    formRef.addEventListener('submit', this.searchHandler);

    this.element.insertAdjacentHTML('beforeend', listTemplate());
    this.imagesList = this.element.querySelector('.gallery');
    this.imagesList.addEventListener('click', this.showModal);

    this.element.insertAdjacentHTML('beforeend', nextBtnTemplate());
    this.nextButton = this.element.querySelector('#load-more');
    this.nextButton.addEventListener('click', this.nextPageHandler);
  }

  renderImages(images) {
    let scrollToElem;
    images.map((image, index) => {
      // <li class="gallery-item">
      // this.imagesList.insertAdjacentHTML('beforeend', cardTemplate(image));
      const cardElement = document.createElement('li');
      cardElement.classList.add('gallery-item');
      cardElement.innerHTML = cardTemplate(image);
      this.imagesList.insertAdjacentElement('beforeend', cardElement);
      //
      //Выриант: data-source="{{largeImageURL}} в шаблон
      // const imgRef = cardElement.querySelector('img');
      // console.log(imgRef);
      // imgRef.dataset.source = image.largeImageURL;
      if (index === 0) {
        scrollToElem = cardElement;
      }
    });

    if (this.currentPage % this.totalPages === 0) {
      this.nextButton.classList.add('hidden');
    } else {
      this.nextButton.classList.remove('hidden');
    }

    if (this.currentPage > 1 && scrollToElem) {
      window.scrollTo({
        top: scrollToElem.offsetTop - 15,
        behavior: 'smooth',
      });
    }
  }

  async getImages() {
    try {
      const results = await apiService.searchImages(
        this.searchQuery,
        this.currentPage,
        this.perPage,
      );
      if (results.hits.length !== 0) {
        this.totalPages = Math.ceil(results.totalHits / this.perPage);
        this.renderImages(results.hits);
      } else {
        errorMsg.show('No images found matching this request.');
      }
    } catch (error) {
      errorMsg.show(error);
    }
  }

  showModal(event) {
    const fullImageSrc = event.target.dataset.source;
    if (fullImageSrc) {
      const instance = basicLightbox.create(`<img src="${fullImageSrc}">`);
      instance.show();
    }
  }

  nextPageHandler() {
    this.currentPage += 1;
    this.getImages();
  }

  searchImages(query) {
    this.searchQuery = query.replace(' ', '+');
    this.currentPage = 1;
    this.totalPages = 0;
    this.imagesList.innerHTML = '';
    this.nextButton.classList.add('hidden');
    this.getImages();
  }

  searchHandler(event) {
    event.preventDefault();
    const searchValue = event.target.elements['query'].value.trim();
    if (searchValue) {
      this.searchImages(searchValue);
    }
  }
}
export default Images;

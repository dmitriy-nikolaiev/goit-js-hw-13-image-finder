const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '21264711-6e022fd5a1fcd486c01aa92d2';

export default {
  async searchImages(query, page) {
    const rawResult = await fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`,
    );

    if (!rawResult.ok) {
      throw rawResult;
    }

    const result = await rawResult.json();

    return result;
  },
};

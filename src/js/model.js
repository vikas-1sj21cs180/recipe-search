import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 😒😒😒😒`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const apiurl = `${API_URL}?search=${query}&key=${KEY}`;

    const data = await AJAX(apiurl);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 😒😒😒😒`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    if (ing.quantity) {
      ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    }
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  // const user = {
  //   name: 'John Doe',
  //   age: 30,
  // };
  // localStorage.setItem('user', JSON.stringify(user));
  // const username = localStorage.getItem('user');
  // console.log(username);
};

export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[1] !== '' && entry[0].startsWith('ingredient'))
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// console.log('localStorage', state.bookmarks);
/*
// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    // console.log(data);
    // getJSON(); this was the error like this <!DOC

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    // Temporary erro handling
    console.error(`${err} 😒😒😒😒`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const apiurl = `${API_URL}?search=${query}`;

    const data = await getJSON(apiurl);

    // state.search.query = query;
    // console.log(state.search.query);
    // const query = document.querySelector('.search__field').value;
    // const apiKey = '067c77b3-e106-4248-9601-1a41e29a360b';

    // const apiurl = `${API_URL}?search=${query}&key=${apiKey}`;
    // const apiurl = `${API_URL}?search=${query}`;

    // const data = await getJSON(apiurl);
    // console.log(data);

    // const allRecipies = data.data.recipes;
    // console.log(data.data.recipes);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    // console.log(state.search.results);
    state.search.page = 1; //if do the new search dispays search result sfrom page start
  } catch (err) {
    console.error(`${err} 😒😒😒😒`);
    throw err;
  }
};
// loadSearchResult('pizza');
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  // console.log(start, end);

  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  // console.log(newServings);
  // console.log(state.recipe);

  state.recipe.ingredients.forEach(ing => {
    if (ing.quantity) {
      ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    }
  });
  state.recipe.servings = newServings;
};

export const addBookMark = function (recipe) {
  ///////////////////////////////////////////////////////////////////////////////////
  // addBookMark
  state.bookmarks.push(recipe);
  // if (pushORpop === 'push') {
  //   state.bookmarks.push(recipe);
  // }
  // if (pushORpop === 'pop') {
  //   state.bookmarks.pop(recipe);
  // }
  console.log(state.bookmarks);
  // mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  // deleteBookMark
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);

  // mark the current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
*/

// import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchview.js';
import resultView from './views/resultsview.js';
import paginationView from './views/paginationview.js';
import bookmarksView from './views/bookmarksview.js';
import addRecipeView from './views/addRecipeview.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsview from './views/resultsview.js';

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(icons);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) update result view to mark to selected search result
    resultView.update(model.getSearchResultsPage());

    // 3) updating bookmark view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    //  1 Loading Recipe
    await model.loadRecipe(id);

    // 2 Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(err);

    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    // console.log(resultView);

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 1) load search result
    await model.loadSearchResult(query);

    // 3) render results
    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    // render initial pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (gotoPage) {
  // 1) render NEW results
  // console.log(model.state.search.results);
  // resultView.render(model.state.search.results);
  resultView.render(model.getSearchResultsPage(gotoPage));

  //2) renger initial pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  ///////////////////////////////////////////////////////////////////////////////
  // 1) Add remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  //Update reipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};
// const controlAddBookmarks = function (pushORpop) {
//   ///////////////////////////////////////////////////////////////////////////////
//   model.addBookMark(model.state.recipe, pushORpop);
//   console.log(model.state.recipe);
// };

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes Message
    addRecipeView.renderMessage();

    //Render BookMarkView
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😒😒', err);
    addRecipeView.renderError(err.message);
  }

  // upload the recipe data
};

const init = function (){
  // controlRecipes();
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandleraddingBookMark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

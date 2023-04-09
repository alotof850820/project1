//controller 調用(import) model的功能函數
//不要有任何與DOM有關的code

import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './view/recipeView';
import searchView from './view/searchView';
import bookmarkView from './view/BookmarksView';
import ResultView from './view/researchResultView';
import pageinationView from './view/pageinationView';
import addRecipeView from './view/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

//parcel專用(動態重新載入更改的程式碼)
// if (module.hot) {
//   module.hot.accept();
// }

//jsDoc文檔
/**
 *
 * @returns
 */

const controlRecipes = async function () {
  try {
    //讀hash id
    const id = location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //更新result view, 鎖定搜尋結果(點選項後一直鎖定)
    ResultView.update(model.getSearchResultsPage());

    //reset書籤
    bookmarkView.update(model.state.bookmarks);

    //load recipe
    await model.loadRecipe(id);
    //render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    ResultView.renderSpinner();
    //1.get search
    const searchValue = searchView.getQuery();
    if (!searchValue) return;
    //2.load search and reset
    await model.loadSearchResults(searchValue);
    //3. render result(一頁10個)
    ResultView.render(model.getSearchResultsPage());
    //4.render init page button
    pageinationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //1. render new result(一頁10個)
  ResultView.render(model.getSearchResultsPage(goToPage));
  //2.render new page button
  pageinationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //更新份量
  model.updateServings(newServings);
  //更新 recipe(不更新整個頁面)
  recipeView.update(model.state.recipe);
};

//add/remove bookmark
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //更新 recipe
  recipeView.update(model.state.recipe);
  //render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //render Recipe
    recipeView.render(model.state.recipe);
    //successMassge
    addRecipeView.renderMessage();
    //render bookmark view
    bookmarkView.render(model.state.bookmarks);
    //chageID in URL
    history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('😒', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerrender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  pageinationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('hi');
};
init();

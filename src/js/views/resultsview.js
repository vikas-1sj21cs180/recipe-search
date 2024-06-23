import View from './view.js';
import previewView from './previewview.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'NO, recipe found for your query! Please try another one';
  _message;

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();

/*
const searchBtn = document.querySelector('.search__btn');
const searchResutContainer = document.querySelector('.search-results');

searchBtn.addEventListener('click', async function (e) {
  //   const query = const searchBtn = document.querySelector('.search__btn');
  //   const searchResutContainer = document.querySelector('.search-results');

  searchBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    //   const query = document.querySelector('.search__field').value;
    //   const apiKey = '067c77b3-e106-4248-9601-1a41e29a360b';
    //   console.log(query);

    //   const apiurl = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${apiKey}`;
    //   // const apiurl = `https://forkify-api.herokuapp.com/api/v2/recipes?search=burger`;

    //   const data = await getJSON(apiurl);

    //   console.log(data);

    //   const makup = `
    //                 <li class="preview">
    //                     <a class="preview__link" href="#${recipe.url}">
    //                       <figure class="preview__fig">
    //                         <img src="${recipe.image_url}" alt="Test" />
    //                       </figure>
    //                       <div class="preview__data">
    //                         <h4 class="preview__name">
    //                           ${recipe.title}
    //                         </h4>
    //                         <p class="preview__publisher">${recipe.publisher}</p>
    //                       </div>
    //                     </a>
    //                 </li>
    //   `;
    ////////////////////////////////////////////
    //   allRecipies.forEach(recipe => {
    //     searchResutContainer.insertAdjacentHTML(
    //       'afterbegin',
    //       `
    //                     <a class="preview__link" href="#${recipe.url}">
    //                        <figure class="preview__fig">
    //                          <img src="${
    //                            recipe.image_url
    //                          }" alt="${recipe.title.substring(0, 10)}" />
    //                        </figure>
    //                        <div class="preview__data">
    //                          <h4 class="preview__name">
    //                            ${recipe.title.substring(0, 10)}
    //                          </h4>
    //                          <p class="preview__publisher">${recipe.publisher}</p>
    //                        </div>
    //                     </a>
    //   `
    //     );
    //   });
  });
*/

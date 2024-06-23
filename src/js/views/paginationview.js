import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;
      // if (e.target.classList('.pagination__btn--prev')) {
      //   console.log('move left');
      // }
      // if (e.target.closest('.pagination__btn--next')) {
      //   console.log('move right ');
      // }
      const gotoPage = +btn.dataset.goto;
      // console.log(gotoPage);
      handler(gotoPage);
    });
  }

  _generateMarkupBtn(direction, arrow) {
    return `
    <button data-goto="${
      direction === 'next' ? this._data.page + 1 : this._data.page - 1
    }" class="btn--inline pagination__btn--${direction}">
              <span>Page ${
                direction === 'next' ? this._data.page + 1 : this._data.page - 1
              }</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-${arrow}"></use>
                </svg>
              </button>`;
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    //page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      // return `<button class="btn--inline pagination__btn--next">
      //       <span>Page ${this._data.page + 1}</span>
      //       <svg class="search__icon">
      //         <use href="${icons}#icon-arrow-right"></use>
      //       </svg>
      //     </button>`;
      return this._generateMarkupBtn('next', 'right');
    }
    //last page
    if (this._data.page === numPages && numPages > 1) {
      // return `<button class="btn--inline pagination__btn--prev">
      //       <svg class="search__icon">
      //         <use href="${icons}#icon-arrow-left"></use>
      //       </svg>
      //       <span>Page ${this._data.page - 1}</span>
      //     </button>`;
      return this._generateMarkupBtn('prev', 'left');
    }
    //other page
    if (this._data.page > 1 && this._data.page < numPages) {
      // return `<button class="btn--inline pagination__btn--prev">
      //       <svg class="search__icon">
      //         <use href="${icons}#icon-arrow-left"></use>
      //       </svg>
      //       <span>Page ${this._data.page - 1}</span>
      //     </button>
      //     <button class="btn--inline pagination__btn--next">
      //       <span>Page ${this._data.page + 1}</span>
      //       <svg class="search__icon">
      //         <use href="${icons}#icon-arrow-right"></use>
      //       </svg>
      //     </button>`;
      return `
       <div class="_page-number">Page ${this._data.page}</div>
        ${this._generateMarkupBtn('prev', 'left')}
        ${this._generateMarkupBtn('next', 'right')}
      `;
    }
    //page 1 and there no other pages
    return '';
  }
}

export default new PaginationView();

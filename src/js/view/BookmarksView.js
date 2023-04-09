//呈現書籤
import { addListener } from 'process';
import { View } from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `新增喜歡的食譜吧!`;
  _message = ``;

  addHandlerRender(handler) {
    addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();

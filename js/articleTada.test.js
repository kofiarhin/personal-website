/**
 * @jest-environment jsdom
 */

const $ = require('jquery');
global.$ = $;
const { articleTada } = require('./main');

test('articleTada selects a valid index', () => {
  document.body.innerHTML = `
    <div class="article-thumb"></div>
    <div class="article-thumb"></div>
    <div class="article-thumb"></div>
  `;

  for (let i = 0; i < 20; i++) {
    articleTada();
    const index = $('.article-thumb').index($('.is-emph'));
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan($('.article-thumb').length);
  }
});

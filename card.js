import { cardContent } from './card-content.js';
import { createBackground } from './components/background.js';
import { createTitle } from './components/title.js';
import { createSubtitle } from './components/subtitle.js';
import { createLetter } from './components/letter.js';
import { createAlbum } from './components/album.js';
import { createCharacter } from './components/character.js';
import { createDecorations } from './components/decorations.js';

const card = document.querySelector('.card');
card.append(
  createBackground(cardContent.background),
  createTitle(cardContent.title),
  ...(cardContent.subtitle ? [createSubtitle(cardContent.subtitle)] : []),
  createLetter(cardContent.letter),
  createAlbum(cardContent.photos),
  createCharacter(cardContent.character),
  createDecorations(),
  ...(cardContent.footer ? [createSubtitle(cardContent.footer, 'footer-note')] : []),
);

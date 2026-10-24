import { cardContent } from './card-content.js';
import { createBackground } from './components/background.js';
import { createTitle } from './components/title.js';
import { createSubtitle } from './components/subtitle.js';
import { createLetter } from './components/letter.js';
import { createAlbum } from './components/album.js';
import { createCharacter } from './components/character.js';
import { createDecorations } from './components/decorations.js';
import { createMusic } from './components/music.js';

const card = document.querySelector('.card');
const music = createMusic(cardContent.music);
const letter = createLetter(cardContent.letter, cardContent.letterSticker);
letter.append(music.createButton());
card.append(
  createBackground(cardContent.background),
  createTitle(cardContent.title),
  ...(cardContent.subtitle ? [createSubtitle(cardContent.subtitle)] : []),
  letter,
  createAlbum(cardContent.photos, cardContent.albumBackground, music),
  createCharacter(cardContent.character),
  createDecorations(),
  ...(cardContent.footer ? [createSubtitle(cardContent.footer, 'footer-note')] : []),
);

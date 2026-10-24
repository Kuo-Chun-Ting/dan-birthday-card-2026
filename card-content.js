// 文字、圖片與相簿順序集中在這裡；各元件的外觀在 components/。
export const cardContent = {
  background: {
    src: './artwork/article2.jpg',
    alt: '粉紫、桃紅與嫩綠交疊的作品細節',
  },
  title: { greeting: 'Happy Birthday' },
  subtitle: '',
  footer: '',
  letter: '',
  character: {
    src: './assets/kuromi-two-brushes.png',
    alt: '同一隻手握著桃紅與螢光綠畫筆的庫洛米',
  },
  photos: Array.from({ length: 44 }, (_, index) => ({
    src: `./us/${String((index + 1) * 10).padStart(3, '0')}.jpg`,
    alt: index === 0 ? '我們在作品前抱著花束的合照' : `我們的合照 ${index + 1}`,
  })),
};

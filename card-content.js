// 文字、圖片與相簿順序集中在這裡；各元件的外觀在 components/。
export const cardContent = {
  background: {
    src: './artwork/article2.jpg',
    alt: '粉紫、桃紅與嫩綠交疊的作品細節',
  },
  title: { greeting: 'Happy Birthday Dan' },
  music: {
    card: './assets/audio/verse.mp3',
    album: './assets/audio/chorus.mp3',
  },
  albumBackground: {
    src: './assets/album-background.jpg',
  },
  subtitle: '',
  footer: '',
  letter: `陳丹：

這是第二次幫你過生日。做卡片的過程中，複習了很多我們的照片，兩個完全不同世界的人，硬是相處了兩年多，蠻好笑也蠻好哭的。

很開心看你鬧著鬧著人生也慢慢上了軌道，離你的理想又更近了一點。考上研究所、找到合拍的老闆，也得到了去英國打工的機會。

謝謝你一路上都很支持我，讓我一直很有安全感，知道無論如何都有你在。希望即使我們不再是情人的關係，也可以一直互相支持著。以後紅了不要忘記我！

你是我心中的大墩第一名，這次用你的作品當主題做了卡片，希望你會喜歡。也準備了我覺得很適合你的珍珠項鍊，希望以後你在國外覺得孤單的時候，看到它就能想起還有我支持著你。

27 歲生日快樂！

2026.10.24 小郭`,
  letterSticker: {
    after: '27 歲生日快樂！',
    src: './assets/alien-sticker.png',
    alt: '開心舉起雙手的三眼怪貼圖',
  },
  character: {
    src: './assets/kuromi.webp',
    alt: '同一隻手握著桃紅與螢光綠畫筆的庫洛米',
  },
  photos: Array.from({ length: 45 }, (_, index) => ({
    src: `./assets/photos/${String((index + 1) * 10).padStart(3, '0')}.webp`,
    thumbnailSrc: `./assets/photos/thumbs/${String((index + 1) * 10).padStart(3, '0')}.webp`,
    alt: index === 0 ? '我們在作品前抱著花束的合照' : `我們的合照 ${index + 1}`,
  })),
};

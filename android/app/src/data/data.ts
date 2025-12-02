// data.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export const products: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 't-shirt.jpg', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'sneaker.jpg', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'balo.jpg', categoryId: 3 },
  { id: 4, name: 'Pijama', price: 120000, img: 'pijama.jpg', categoryId: 4 },
  { id: 5, name: 'Áo thể thao', price: 980000, img: 'gym.jpg', categoryId: 5 },
];

export const popularProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 't-shirt.jpg', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'sneaker.jpg', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'balo.jpg', categoryId: 3 },
  { id: 4, name: 'Pijama', price: 120000, img: 'pijama.jpg', categoryId: 4 },
  { id: 5, name: 'Áo thể thao', price: 980000, img: 'gym.jpg', categoryId: 5 },
];

export const images: { [key: string]: any } = {
  't-shirt.jpg': require('../assets/book_images/t-shirt.jpg'),
  'sneaker.jpg': require('../assets/book_images/sneaker.jpg'),
  'balo.jpg': require('../assets/book_images/balo.jpg'),
  'pijama.jpg': require('../assets/book_images/pijama.jpg'),
  'gym.jpg': require('../assets/book_images/gym.jpg'),
};
    
// Task 1: Product type
type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

// Two products using this type
const laptop: Product = {
  name: 'MacBook Air',
  price: 999.99,
  inStock: true,
};

const headphones: Product = {
  name: 'AirPods Pro',
  price: 249.999,
  inStock: false,
};

// Task 2: helper function
function formatPrice(price: number): string {
  return `$${price}`;
}

// Check that everything works
console.log(laptop);
console.log(headphones);
console.log(formatPrice(9.99));
console.log(formatPrice(laptop.price));






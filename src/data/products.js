export const ALL_PRODUCTS = [
  { 
    id: '1', 
    name: 'New Star Appalam (2.5 Small)', 
    price: 160, 
    category: 'Appalam', 
    description: 'Premium homemade New Star Appalam. Size 2.5 (Small). Pure ingredients and traditional recipe. 100% Natural.', 
    isNew: true, 
    image1: '/images/appalam-packaging.jpg',
    image2: '/images/appalam-raw.png'
  },
  { 
    id: '2', 
    name: 'New Star Appalam (3.5 Medium)', 
    price: 160, 
    category: 'Appalam', 
    description: 'Premium homemade New Star Appalam. Size 3.5 (Medium). Pure ingredients and traditional recipe. 100% Natural.', 
    isNew: false, 
    image1: '/images/appalam-packaging.jpg',
    image2: '/images/appalam-raw.png'
  },
  { 
    id: '3', 
    name: 'New Star Appalam (4.5 Large)', 
    price: 160, 
    category: 'Appalam', 
    description: 'Premium homemade New Star Appalam. Size 4.5 (Large). Pure ingredients and traditional recipe. 100% Natural.', 
    isNew: true, 
    image1: '/images/appalam-packaging.jpg',
    image2: '/images/appalam-raw.png'
  },
];

export const CATEGORIES = ['All', 'Appalam'];

export const getFeaturedProducts = (count = 3) => {
  return ALL_PRODUCTS.slice(0, count);
};

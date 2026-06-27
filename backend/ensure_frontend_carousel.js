const fs = require('fs');
const path = require('path');

// This is a small script to verify frontend can read carousel images by checking
// that the public path exists and printing the expected URLs.
const carouselDir = path.join(__dirname, 'uploads', 'carousel');
if (!fs.existsSync(carouselDir)) {
  console.error('Carousel directory missing:', carouselDir);
  process.exit(1);
}
const files = fs.readdirSync(carouselDir).filter(f => f.match(/carousel_\d+\.(webp|jpg|jpeg|png)$/i));
console.log('Found carousel files:', files.length);
files.forEach(f => console.log('/uploads/carousel/' + f));

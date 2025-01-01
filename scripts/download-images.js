const https = require("https");
const fs = require("fs");

const images = {
  "hero-wholesale.jpg":
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600",
  "categories/office-supplies.jpg":
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800",
  "categories/electronics.jpg":
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
  "categories/furniture.jpg":
    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800",
  "categories/safety.jpg":
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
  "categories/packaging.jpg":
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800",
  "categories/cleaning.jpg":
    "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800",
  "testimonials/sarah.jpg":
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  "testimonials/michael.jpg":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
};

// Create directories if they don't exist
["testimonials", "categories", "partners"].forEach((dir) => {
  if (!fs.existsSync(`public/images/${dir}`)) {
    fs.mkdirSync(`public/images/${dir}`, { recursive: true });
  }
});

// Download images
Object.entries(images).forEach(([filename, url]) => {
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(`public/images/${filename}`);
    response.pipe(fileStream);
    fileStream.on("finish", () => {
      console.log(`Downloaded: ${filename}`);
    });
  });
});

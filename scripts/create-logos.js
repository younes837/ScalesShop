const fs = require("fs");

const companies = ["techcorp", "global", "innovate", "securenet"];
const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

companies.forEach((company, index) => {
  const svg = `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="100" fill="white"/>
    <text x="100" y="50" font-family="Arial" font-size="24" fill="${
      colors[index]
    }" text-anchor="middle" dominant-baseline="middle">
      ${company.toUpperCase()}
    </text>
  </svg>`;

  fs.writeFileSync(`public/images/partners/${company}.png`, Buffer.from(svg));
});

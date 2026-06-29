import fs from 'fs';
import * as cheerio from 'cheerio';

async function main() {
  let html = fs.readFileSync('arcade_page.html', 'utf-8');
  html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const $ = cheerio.load(html);
  
  // Find card titles
  $('.card').each((i, el) => {
     console.log('Title:', $(el).find('.card-title').text().trim());
     console.log('Image:', $(el).find('img').attr('src'));
     console.log('Link:', $(el).find('a').attr('href'));
     console.log('---');
  });
}

main();

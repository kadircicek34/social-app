const fs = require('fs')

const src = 'google-services.json'
const example = 'google-services.json.example'
if (!fs.existsSync(src)) {
  if (fs.existsSync(example)) {
    fs.copyFileSync(example, src)
    console.log(`Copied ${example} to ${src}`)
  } else {
    console.error(`Neither ${src} nor ${example} found`)
  }
}

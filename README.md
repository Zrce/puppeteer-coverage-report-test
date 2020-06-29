# puppeteer-coverage-report-test

Puppeteer script using Chrome's Coverage Report for CSS and JavaScript files. 

Article about this: https://medium.com/@WillmannTobias/how-to-bulk-find-unused-css-and-javascript-with-puppeteer-and-chrome-coverage-f79f7d885d59

Documentation: https://pptr.dev/#?product=Puppeteer&version=v3.3.0&show=api-class-coverage

# Install
use "npm install" to install 
```
"fs": 
"puppeteer":
```

# How to run
Open index.js and setup the URLs you want to test, some projectname:

```javascript
const projectname = "blick2"
const urlToTest = [
    "https://www.blick.ch/",
    "https://www.blick.ch/news/politik/krisengipfel-in-bern-wer-stoppt-die-corona-idioten-id15961017.html"
]
```

Start the script with 
```
node index.js
```

# Results 
The script will create a folder 
```
/results/#your-filename#/
```

Within the folder you will find data.csv 

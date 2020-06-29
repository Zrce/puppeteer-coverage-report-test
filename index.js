const puppeteer = require('puppeteer')
const fs = require("fs");

const projectname = "blick3"
const urlToTest = [
    "https://www.blick.ch/",
    "https://www.blick.ch/news/politik/krisengipfel-in-bern-wer-stoppt-die-corona-idioten-id15961017.html",
    "https://www.blick.ch/news/schweiz/aktuelle-news-zum-coronavirus-ticker-zum-sars-aehnlichen-virus-aus-china-id15715896.html",
    "https://www.blick.ch/news/partygaenger-unbesorgt-trotz-superspreader-ich-habe-keine-angst-vor-dem-corona-virus-id15960405.html",
    "https://www.blick.ch/sport/fussball/nati/ihre-vision-soll-weiterleben-heute-ist-ismailis-24-todestag-freundinnen-ehren-sie-id15960728.html",
    "https://www.blick.ch/news/mega-party-ohne-ruecksicht-auf-corona-berner-polizei-laesst-illegale-partygaenger-raven-id15960847.html",
    "https://www.blick.ch/news/",
    "https://www.blick.ch/services/webarchiv/",
    "https://www.blick.ch/dossiers/",
    "https://www.blick.ch/dossiers/adele/",
    "https://www.blick.ch/news/raumfahrt-start-von-vega-rakete-wegen-unwetters-erneut-verschoben-id15960910.html",
    "https://www.blick.ch/services/webarchiv/18_juni_2020/",
    "https://www.blick.ch/life/reisen/ratgeber/",
    "https://www.blick.ch/life/reisen/ch/wander-hotel-hopping-im-oberengadin-schwerelos-ueber-berge-und-blumen-id15944762.html",
    "https://www.blick.ch/community/die-grosse-frage-wie-sieht-ihr-perfekter-sommertag-aus-id15959980.html",
    "https://www.blick.ch/news/schweiz/schweizer-hunger-auf-billig-ware-fleisch-um-jeden-preis-id15959710.html",
    "https://www.blick.ch/meinung/thema-der-woche/",
    "https://www.blick.ch/sport/segeln/",
    "https://www.blick.ch/digital/gadgets-technik/chinaschrott-oder-wish-schnaeppchen-handyhalterung-fuers-auto-kostet-nur-sechs-franken-id15959050.html"
]

//Scroll to end of the page 
const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);  
                    resolve();
                }
            }, 100);
        });
    });
}

const run = async (url) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setCacheEnabled(false);
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);
    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await autoScroll(page);

    // Disable both JavaScript and CSS coverage
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);
    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {

        if (entry.url.indexOf('.js') > 0 || entry.url.indexOf('.css') > 0) {
            totalBytes += entry.text.length;
            let singleUsedBytes = 0
            for (const range of entry.ranges) {
                usedBytes += range.end - range.start - 1;
                singleUsedBytes += range.end - range.start - 1;
            }

            //Single css or js file data
            let singleUnusedBytes = 100 - (singleUsedBytes / entry.text.length * 100)
            //console.log(singleBytes.toFixed(1) + '% used in ' + entry.url)
            //Write csv
            await fs.appendFile('results/' + projectname + '/data.csv', url + ', ' + entry.url + ', ' + singleUnusedBytes.toFixed(1) + '\r\n', function (err) {
                if (err) throw err;
            });
        }
    }

    console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
    await browser.close()
}

//Start
const start = async () => {

    //Generate output file
    await fs.promises.mkdir('results/' + projectname, { recursive: true })
    if (!fs.existsSync('results/' + projectname + '/data.csv')) {
        await fs.appendFile('results/' + projectname + '/data.csv', 'url, asset url, % unused\r\n', function (err) {
            if (err) throw err;
        });
    }

    //Look URL array
    for (let i = 0; i < urlToTest.length; i++) {
        await run(urlToTest[i])
    }
}

start()
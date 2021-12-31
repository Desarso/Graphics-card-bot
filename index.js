const puppeteer =require('puppeteer');
const { threadId } = require('worker_threads');
const fs = require('fs').promises;
//let url = 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3070-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6429442.p?skuId=6429442'
let url = "https://www.google.com/"

 const mainFunction = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        //  args: ['--single-process','--no-zygote','--no-sandbox']
        args: [`--window-size=1920,1080`],
        defaultViewport: {
          width:1920,
          height:1080
        }
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    console.log('page opened')

    page.on('requestfailed', async (request) => {
        // console.log(`url: ${request.url()}, errText: ${request.failure().errorText}, method: ${request.method()}`);
        // console.log('request failed')
        // console.log(request.url())
        if (request.url == url){
            await page.evaluate(() => window.stop());
            await browser.close();
        }
           
    });
    // page.on("pageerror", err => {
    //     console.log(`Page error: ${err.toString()}`);
    // });
    // Catch all console messages
    // page.on("error", function (err) {  
    //     theTempValue = err.toString();
    //     console.log("Error something has gone wrong");
    //     page.evaluate(() => window.stop());
    //     browser.close(); 
    // });
    page.goto(url).catch(async(err) => {
            console.log('Navigation failure');
            await page.screenshot({path:'./images/goto-error.png'})
            await page.evaluate(() => window.stop());
            await browser.close();
        });

        await page.screenshot({path:'./images/product-page.png'}).catch(async(err) => {
            console.log('target closed');
            pageFailure = "true";
            await page.evaluate(() => window.stop());
            await browser.close();
        });
        if (typeof pageFailure !== 'undefined') console.log(pageFailure);
        if (typeof pageFailure != 'undefined' && pageFailure == 'true'){return};

        await page.waitForSelector('.fulfillment-add-to-cart-button div div button').catch(async(err) => {
            console.log('target closed');
            pageFailure = "true";
            await page.screenshot({path:'./images/element-error.png'})
            await page.evaluate(() => window.stop());
            await browser.close();
        })

    if (typeof pageFailure !== 'undefined') console.log("This site isnt supported brah");
    if (typeof pageFailure != 'undefined' && pageFailure == 'true'){return};

        console.log('navigation succesful');
        let inStockState = await page.evaluate(() => {
        let button = document.querySelector('.fulfillment-add-to-cart-button div div button').innerText;
        button = button.toString();
        return button
    }).catch((err) => {console.log('target closed')})
    
    console.log(inStockState);
    if (inStockState === "Add to Cart"){
        console.log("hell yeah bitches");
        await page.waitForSelector('.fulfillment-add-to-cart-button div div button');
        await page.waitFor(500);
        await page.click('.fulfillment-add-to-cart-button div div button');
        console.log('clicked')
        await page.evaluate(() => window.stop());
        await browser.close();
        // await page.close();
        // await browser.close();
    }else { 
        console.log("sad face");
        mainFunction(url);
    }
    
        
        
    
    
    };
    
mainFunction(url);
   
        // await page.goto('https://www.google.com/');

    // await page.waitForSelector('.whsOnd.zHQkBf')
    // await page.type('.whsOnd.zHQkBf','g.maleksaborio@ubreakifix.com')
    // await page.waitForSelector('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b')    
    // await page.click('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b')
    // await page.waitForTimeout(2000)
    // await page.waitForSelector('.whsOnd.zHQkBf')
    // await page.type('.whsOnd.zHQkBf','Costillas1')
    // await page.waitForSelector('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b')
    // await page.click('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b')
    // await page.screenshot({path:'./google.png'})
    // await page.waitForTimeout(10000)
    // const cookies= await page.cookies();
    // await fs.writeFile('./cookies.json',JSON.stringify(cookies, null, 2));
    // let loggedIn = {'loogedIn':'true'}
    // await fs.writeFile('./loogedIn.json',JSON.stringify(loggedIn))
    // await browser.close()

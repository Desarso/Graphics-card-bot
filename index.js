const puppeteer =require('puppeteer');
const { threadId } = require('worker_threads');
const fs = require('fs');
const path = require('path')

data = fs.readFileSync('./userData.JSON');
let dataArray = [];
dataArray = JSON.parse(data);

let url = dataArray.url;
let email = dataArray.email;
let password = dataArray.password;
let cvv = dataArray.cvv;


const mainFunction = async (url, email, password, cvv) => {
    const browser = await puppeteer.launch({
        headless: false,
        //  args: ['--single-process','--no-zygote','--no-sandbox']
        args: [`--window-size=1920,1080`],
        defaultViewport: {
          width:1250,
          height:1900
        }
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    console.log('page opened')

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

    if (inStockState == 'Add to Cart'){console.log('Product in Stock')}
    else {console.log(inStockState)};

    if (inStockState === "Add to Cart"){
        console.log("hell yeah bitches");
        await page.waitForSelector('.fulfillment-add-to-cart-button div div button');
        await page.waitForTimeout(700);
        await page.click('.fulfillment-add-to-cart-button div div button');
        console.log('added to cart');
        await page.waitForSelector('.order-summary__checkout-buttons-container div div button');
        await page.waitForTimeout(500);
        await page.click('.order-summary__checkout-buttons-container div div button');
        console.log("going to checkout");
        await page.waitForSelector('#fld-e');
        await page.type('#fld-e',email);
        await page.waitForSelector('#fld-p1');
        await page.type('#fld-p1',password);
        await page.waitForSelector('.c-button.c-button-secondary.c-button-lg.c-button-block.c-button-icon.c-button-icon-leading.cia-form__controls__submit');
        await page.click('.c-button.c-button-secondary.c-button-lg.c-button-block.c-button-icon.c-button-icon-leading.cia-form__controls__submit');
        console.log('login in')
        await page.waitForSelector('#cvv').catch(async(err) => {
            console.log('Skipping CVV check');
        });
        console.log('found cvv input field')
        await page.type('#cvv',cvv).catch(async(err) => {
            console.log('skipping CVV type')
        });
        console.log('typed CVV')
        await page.waitForSelector('.button--place-order-fast-track .payment__order-summary button');
        await page.click('.button--place-order-fast-track .payment__order-summary button');
        console.log('Clicked button');
        await page.waitForTimeout('10,000');
        await page.evaluate(() => window.stop());
        await browser.close();
    }else { 
        console.log("sad face");
        mainFunction(url);
    }
    };
    
mainFunction(url, email, password, cvv);
   

    // await fs.writeFile('./loogedIn.json',JSON.stringify(loggedIn))




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
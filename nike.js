var aesjs = require('aes-js');
const delay = require('delay');
var jar = require('request').jar();
var request = require('request').defaults({ jar: jar });
var cheerio = require('cheerio');
var fs = require('fs');
var HttpsProxyAgent = require('https-proxy-agent');
const { post } = require('request');
const { pid } = require('process');
const { count } = require('console');
const { firefox } = require('playwright-firefox');

// Product info
let productPID = "FZ1269";
let size = "10.5";
variant = '';
// Profile Info
let profileName = 'Tyler Bowen';
let email = 'tylercbowen@gmail.com';
let phone_number = "4055130231";
let first_Name = 'Tyler';
let last_Name = 'Bowen';
let address_One = "1409 lamplighter lane";
let address_Two = "";
let city = "Edmond";
let state = "Oklahoma"; // Full name
let country = "USA"; // Abbreviated.
let zip_Code = "73034";
let card_Number = "4985031098839711"; // No spaces
let month = "04"; // Two digits
let year = "2024"; // Four digits
let cvv = "724";
let card_Holder = "Tyler Bowen";
let cardType = 'Visa';
let proxy = "us-dynamic.boroinc.com:16931:267433+US+267433:redhawks02";

let monitor_delay = 3333;
let error_delay = 3600;

let requestProxy;
if (proxy != "") {
    let proxyElements = proxy.split(':');
    proxy = 'http://' + proxy;
    if (proxyElements.length == 4) {
        requestProxy = `http://${proxyElements[2]}:${proxyElements[3]}\@${proxyElements[0]}:${proxyElements[1]}`;
    } else if (proxyElements.length == 2) {
        requestProxy = proxy;
    } else {
        log({ type: 'error', message: "Wrong proxy!" });
        return;
    }
}
var proxiedRequest = request.defaults({ 'proxy': requestProxy });
let startTime;
let endTime;
let token;
let browser;
let cookie;
let url;

let proxyServer = "";
let proxyUser = "";
let proxyPass = "";

function spoofHeadless() {
    Object.defineProperty(window.navigator, 'languages', {
        get() { return ['en-US', 'en']; },
    });

    const pluginData = [
        { name: "Chrome PDF Plugin", filename: "internal-pdf-viewer", description: "Portable Document Format" },
        { name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai", description: "" },
        { name: "Native Client", filename: "internal-nacl-plugin", description: "" },
    ]
    const pluginArray = [];
    pluginData.forEach(p => {
        function FakePlugin() { return p }
        const plugin = new FakePlugin()
        Object.setPrototypeOf(plugin, Plugin.prototype);
        pluginArray.push(plugin)
    })
    Object.setPrototypeOf(pluginArray, PluginArray.prototype);

    Object.defineProperty(window.navigator, 'plugins', {
        get() { return pluginArray },
    });

    const { getParameter } = WebGLRenderingContext;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
        if (parameter === 37445)
            return 'Intel Open Source Technology Center';

        if (parameter === 37446)
            return 'Mesa DRI Intel(R) Ivybridge Mobile ';


        return getParameter(parameter);
    };

    ['height', 'width'].forEach(property => {
        const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, property);

        Object.defineProperty(HTMLImageElement.prototype, property, {
            ...imageDescriptor,
            get() {
                if (this.complete && this.naturalHeight == 0)
                    return 20;

                return imageDescriptor.get.apply(this);
            },
        });
    });

    const elementDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

    Object.defineProperty(HTMLDivElement.prototype, 'offsetHeight', {
        ...elementDescriptor,
        get() {
            if (this.id === 'modernizr')
                return 1;

            return elementDescriptor.get.apply(this);
        },
    });
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    time = "[" + h + ":" + m + ":" + s + "] ";
    return time;
}

async function ActLikeYouBelong() {
    console.log(getTime() + 'Simulating mouse movement.');
    startingX = Math.floor(Math.random() * (1920 - 0 + 1) + 0);
    startingY = Math.floor(Math.random() * (1080 - 0 + 1) + 0);
    finalX = Math.floor(Math.random() * (1920 - 0 + 1) + 0);
    finalY = Math.floor(Math.random() * (1080 - 0 + 1) + 0);
    await page.mouse.move(startingX, startingY);
    await page.mouse.move(finalX, finalY);
    return;
}

let settings;
async function generateCookies() {
    if (proxyServer.length == 0) {
        browser = await firefox.launch();
    } else {
        settings = { headless: false, proxy: { server: `http://` + proxyServer, username: proxyUser, password: proxyPass } };
        
        console.log(settings);
        browser = await firefox.launch(settings);
    }
    page = await browser.newPage();
    await page.setViewportSize({
        width: 1440,
        height: 800
    });

    try {
        await page.addInitScript(spoofHeadless);
        await page.setDefaultNavigationTimeout(error_delay);
        response = await page.goto('https://yeezysupply.com/');
        console.log(getTime() + 'Grabbing cookie from browser.');
        await delay(2333);
        await ActLikeYouBelong();
        token = response.headers()['set-cookie'];
        cookie = token.substring(
            token.lastIndexOf("_abck=") + 6,
            token.lastIndexOf("~-1;") + 3,
        );
        console.log(getTime() + 'Grabbed cookie: ' + cookie);
        await browser.close();
        initialize();
        return;
    } catch(err) {
        console.log('---->>>>>', err);
    }
}

async function initialize() {
    console.log(getTime() + 'Initializing.');
    await proxiedRequest.get({
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        url: 'https://yeezysupply.com',
    }, async function (error, response, body) {
        //console.log(response);
        if (response.statusCode == 200) {
            console.log(getTime() + 'Site accessed!');
            console.log(getTime() + 'Going to product.');
            startTime = getTime();
            retrieveProduct();
            return;
        }
        else {
            console.log(getTime() + 'Had error: ' + response.statusCode);
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
    });
}

async function retrieveProduct() {
    url = 'https://yeezysupply.com/product/' + productPID;
    console.log(url);
    await proxiedRequest.get({
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        url: 'https://yeezysupply.com/product/' + productPID,
    }, async function (error, response, body) {
        if (body.includes('UNFORTUNATELY WE ARE UNABLE TO GIVE YOU ACCESS TO OUR SITE AT THIS TIME.')) {
            console.log(getTime() + 'Error: Proxy is banned or invalid product ID.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            console.log(body);
            return;
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else {
            console.log(getTime() + 'Entering queue.');
            console.log(body);
            queue();
            return;
        }
    });
}

async function queue() {
    await proxiedRequest.get({
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        url: url,
    }, async function (error, response, body) {
        if (response.statusCode == 403) {
            console.log(getTime() + 'Still in queue.');
            await delay(3000);
            queue();
            return;
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else if (response.statusCode == 200) {
            console.log(getTime() + 'Passed queue!');
            add_to_cart();
        }
    });
}

async function add_to_cart() {
    cartJSON = [
        {
            "product_id": productPID,
            "product_variation_sku": variant,
            "productId": variant,
            "quantity": 1,
            "size": size,
            "displaySize": size
        }
    ];
    await proxiedRequest({
        method: 'post',
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        body: cartJSON,
        url: 'https://www.yeezysupply.com/api/checkout/baskets/-/items',
    }, async function (error, response, body) {
        if (response.statusCode == 200) {
            console.log(getTime() + 'Successfully added to cart!');
            sendShipping();
            return;
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else {
            console.log(getTime() + 'Had unknown error: ' + response.statusCode);
            await delay(error_delay)
            add_to_cart();
            return;
        }
    })
}

async function sendShipping() {
    shippingJSON = {
        "shippingAddress":
        {
            "country": country,
            "firstName": first_Name,
            "lastName": last_Name,
            "address1": address_One,
            "address2": address_Two,
            "city": city,
            "stateCode": state,
            "zipcode": zip_Code
        }
    }
    await proxiedRequest({
        method: 'post',
        headers: {
            'method': 'patch',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        body: shippingJSON,
        url: 'https://www.yeezysupply.com/api/checkout/baskets/',
    }, async function (error, response, body) {
        url = response.request.href;
        if (response.statusCode == 200) {
            console.log(getTime() + 'Sent shipping.');
            sendBilling();
            return;
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else {
            console.log(getTime() + 'Had unknown error: ' + response.statusCode);
            await delay(error_delay)
            sendShipping();
            return;
        }
    });
}

async function sendBilling() {
    console.log(getTime() = 'Sending billing.');
    billingJSON = {
        "customer":
            { "email": email, "receiveSmsUpdates": false },
        "shippingAddress":
        {
            "country": country,
            "firstName": first_Name,
            "lastName": last_Name,
            "address1": address_One,
            "address2": address_Two,
            "city": city,
            "stateCode": state,
            "zipcode": zip_Code,
            "phoneNumber": phone_number
        },
        "billingAddress":
        {
            "country": country,
            "firstName": first_Name,
            "lastName": last_Name,
            "address1": address_One,
            "address2": address_Two,
            "city": city,
            "stateCode": state,
            "zipcode": zip_Code,
            "phoneNumber": phone_number
        },
        "methodList": [{ "id": "2ndDay-1", "shipmentId": "me", "collectionPeriod": "", "deliveryPeriod": "" }], "newsletterSubscription": true
    };
    await proxiedRequest({
        method: 'post',
        headers: {
            'method': 'patch',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        body: billingJSON,
        url: 'https://www.yeezysupply.com/api/checkout/baskets/',
    }, async function (error, response, body) {
        url = response.request.href;
        if (response.statusCode == 200) {
            console.log(getTime() + 'Sent billing.');
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else {
            console.log(getTime() + 'Had unknown error: ' + response.statusCode);
            await delay(error_delay)
            adyenBypass();
            return;
        }
    });
}

async function adyenBypass() {
    basket = url.substring(
        url.lastIndexOf("https://www.yeezysupply.com/api/checkout/baskets/") + 49,
        url.lastIndexOf("https://www.yeezysupply.com/api/checkout/baskets/") + 75,
    );
    var now = new Date;
    var utc_year = Date.UTC(now.getUTCFullYear());
    var utc_month = Date.UTC(now.getUTCMonth());
    var utc_day = Date.UTC(now.getUTCDate());
    var utc_hours = Date.UTC(now.getUTCHours());
    var utc_minutes = Date.UTC(now.getUTCMinutes());
    var utc_seconds = Date.UTC(now.getUTCSeconds());
    var utc_ms = Date.UTC(now.getUTCMilliseconds());
    timeUTC = utc_year + '-' + utc_month + '-' + utc_day + 'T' + utc_hours + ':' + utc_minutes + ':' + utc_seconds + '.' + utc_ms;
    aesKEY = [211, 230, 56, 196, 255, 13, 107, 44, 124, 11, 172, 57, 108, 47, 222, 207, 139, 212, 162, 56, 51, 163, 147, 100, 195, 176, 241, 192, 75, 86, 32, 68,];
    adyenData = card_Number + cvv + card_Holder + month + year + timeUTC + cardType + '44111110';
    adyenBytes = aesjs.utils.utf8.toBytes(adyenData);
    var aesCtr = new aesjs.ModeOfOperation.ctr(aesKEY);
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    adyenJSON = {
        "basketId": basket,
        "encryptedInstrument": "adyenjs_0_1_21$" + encryptedHex,
        "paymentInstrument":
        {
            "holder": card_Holder,
            "expirationMonth": month,
            "expirationYear": year,
            "lastFour": card_Number.substring(card_Number.length - 4),
            "paymentMethodId": "CREDIT_CARD",
            "cardType": cardType
        },
        "fingerprint": "36cMbcuFZD0030000000000000bsx09CX6tD0050271576cVB94iKzBGpDG3z5dXZ05S16Goh5Mk0045zgp4q8JSa00000qZkTE00000PRbZ1HbvOQilRT4oSYkB:40"
    };
    await proxiedRequest({
        method: 'post',
        headers: {
            'method': 'patch',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.64',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Accept-Encoding': 'none',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-control': 'max-age=0',
            'cookie': cookie,
        },
        url: 'https://www.yeezysupply.com/api/checkout/orders',
    }, async function (error, response, body) {
        url = response.request.href;
        if (response.statusCode == 400) {
            console.log(getTime() + 'Invalid billing.');
            return;
        }
        else if (response.statusCode == 404) {
            console.log(getTime() + 'Product not available.');
            console.log(getTime() + 'Retrying.');
            await delay(error_delay);
            generateCookies();
            return;
        }
        else if (response.statusCode == 201 || response.statusCode == 200) {
            console.log(getTime() = 'Checked out!');
            return;
        }
        else {
            console.log(getTime() + 'Had unknown error: ' + response.statusCode);
            await delay(error_delay)
            sendShipping();
            return;
        }
    });
}

generateCookies();
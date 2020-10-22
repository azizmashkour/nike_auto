const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const fs = require('fs');
const schedule = require('node-schedule')
const {installMouseHelper} = require('./extras/install_mouse_helper');
require('dotenv').config()

var browser = null;
async function runBrowser() {
  browser = await puppeteer.launch({
	ignoreDefaultArgs: ["--enable-automation"],
	ignoreHTTPSErrors: true,
    headless: false,
    slowMo: 40,
    args: [	  
	  '--disable-dev-shm-usage',
      "--start-maximized",
      "--window-size=1920,1040",
	  "--disable-infobars"
    ],
  });
}

const runSnkrBot = () => {

	// Debugging stuff
	const html_path = 'htmls/bot_';
	const screenshot_path = 'screenshots/bot_';
	const SimpleNodeLogger = require('simple-node-logger'),
		opts = {
			logFilePath: 'logs/' + 'bot.log',
			timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
		};
	let html = '';


	// ####################################
	// ####################################
	// Parameters to set

	// user/pass: the email/username for your Nike.com account
	const email = process.env.EMAIL;
	const pass = process.env.PASS;

	// cv_code: 3-digit credit card validation code for the card saved to your Nike.com account
	const cv_code = process.env.CV_CODE

	// size: the shoe size, as you see in the table of sizes on a product page, e.g., 'M 9 / W 10.5'
	const size = 'UK 9.5';

	/* date: the date and time the shoe is being dropped at. Months will begin at zero so be sure to subratct one from any month.
		Date format should be as follows: (year, month - 1, day, hour, minute, seconds) 
	*/
	const date = new Date(2020, 4, 19, 23, 48, 30);

	// url: url to the shoe page, e.g., 'https://www.nike.com/za/launch/t/drifter-gator-ispa-coastal-blue-volt'
	const url = 'https://www.nike.com/za/launch/t/drifter-gator-ispa-coastal-blue-volt';

	// debug: Use debug/logging features?
	// Includes writing updates to log file, writing html snapshots, and taking screenshots
	const debug = true;

	// buy: ****WARNING**** if you set this to true it *may* actually make a purchase
	// you can leave this to false and the bot will not "submit order"
	const buy = false;





	// ####################################
	// ####################################
	// main flow
	(async () => { 
		await runBrowser();
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 800 });
		
		if(debug == true){	
			await installMouseHelper(page); // Makes mouse visible
			
			var dir = './htmls';
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			dir = './screenshots';
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			dir = './logs';
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			
			log = SimpleNodeLogger.createSimpleFileLogger( opts );
			log.setLevel('info');	
			
		}
			
		try {
			await page.goto(url,{
				waitUntil: 'networkidle0', timeout:0
			});
		} catch (error) {
			console.log("No free item exists");
		}
	
		await page.waitFor(3000);
		
		// #####################s#############################
		// ##################################################
		// ################################## ROUND 1
		// BEGIN
		
		// #### LOG / DEBUG
		if(debug == true){	
			log.info('1. Page loaded');	
			html = await page.content();
			fs.writeFileSync(html_path + "_1_loaded_" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_1_loaded_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		

		// #### Login to Account
		try {
			await page.waitForSelector(
				'[class*="join-log-in"]'
			);
		} catch (error) {
			
		}
		await page.click('[class*="join-log-in"]');
		await page.waitFor(3000);

		// Username
		await page.waitForSelector('[data-componentname="emailAddress"]');
		await page.type(
			'[data-componentname="emailAddress"]',
			email,
			{ delay: 5 }
		);
		await page.waitFor(3000);
			
		// Password
		await page.type('[data-componentname="password"]', pass, {
			delay: 5,
		});
		await page.waitFor(500);
		// Submit
		await page.click('[value="SIGN IN"]');
		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('2. Logged in');
			html = await page.content();
			fs.writeFileSync(html_path + "_2_logged_in__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_2_logged_in_" + Math.floor(new Date() / 1000) + '.png'});
		}
		// //#### LOG / DEBUG END
			
		await page.waitFor(3000);	
		


		
		// ##################################################
		// ##################################################
		// ################################## ROUND 2	
		// Wait for size selector to appear, then scroll to it
		// schedule.scheduleJob(date, async () => {
		// 	console.log("testing schedule")

		// })
		

		try {
			await page.waitForSelector('.size-grid-dropdown');
			await page.evaluate(() =>
				document.querySelectorAll(".size-grid-dropdown")[0].scrollIntoView()
			);
		} catch (error) {
			console.log(error)
		}
		
		// #### LOG / DEBUG
		if(debug == true){	
			log.info('. Selectors appeared');	
			html = await page.content();
			fs.writeFileSync(html_path + "_3_selectors_" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_3_selectors_" + Math.floor(new Date() / 1000) + '.png'});	
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(3000);
		


		// ##################################################
		// ##################################################
		// ################################## ROUND 3
		// Pick my size from the options
		
		await page.evaluate(async(size) => {
			let sizes = Array.from(document.querySelectorAll(".size-grid-dropdown"));
			let sizeIndex = sizes
				.map((s, i) => (s.innerHTML === size ? i : false))
				.filter(Boolean)[0];
			return sizes[sizeIndex].click();
		}, size);
		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('3. Found and clicked on size');
			html = await page.content();
			fs.writeFileSync(html_path + "_4_size_clicked__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_4_size_clicked_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(500);
		
		
		
		
		// ##################################################
		// ##################################################
		// ################################## ROUND 4	
		// Wait for add to cart button, then scroll into view
		
		await page.waitForSelector('button[data-qa="add-to-cart"]');
		await page.evaluate(() =>
			document.querySelectorAll('button[data-qa="add-to-cart"]')[0].scrollIntoView()
		);
		console.log("***************************ddddd******")
		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('4. Scrolled to add button');
			html = await page.content();
			fs.writeFileSync(html_path + "_5_scroll_to_add_button__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_5_scroll_to_add_button_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(500);
		
		
		
		
		// ##################################################
		// ##################################################
		// ################################## ROUND 5	
		// Click the add to cart button
		
		await page.evaluate(() =>
			document.querySelectorAll('button[data-qa="add-to-cart"]')[0].click()
		);

		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('5. Clicked add button');
			html = await page.content();
			fs.writeFileSync(html_path + "_6_clicked_add_button__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_6_clicked_add_button_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(500);	
		
		
		//Press Member Checkout

		try {
			await page.waitForSelector("button[data-qa='checkout-link']");
			await page.evaluate(() =>
				document.querySelectorAll("button[data-qa='checkout-link']")[0].click()
			);
		} catch (error) {
			console.log(error)
		}


		// ##################################################
		// ##################################################
		// ################################## ROUND 7
		// Enter credit card info
		
		
		
		await page.evaluate(() =>
			document.querySelectorAll('[data-automation="member-checkout-button"]')[0].scrollIntoView()
		);
		await page.waitFor(200);
		
		const target_frame = page.frames().find(frame => frame.url().includes('paymentcc.nike.com'));
		
		await target_frame.evaluate(
			() => (document.getElementById("cvNumber").focus())
		);	
		await target_frame.waitFor(1000);
		await page.keyboard.type(cv_code, {delay: 10});
		
		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('7. Entered CV');
			html = await page.content();
			fs.writeFileSync(html_path + "_7_entered_cv__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_7_entered_cv_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(500);	
		
		
		
		// ##################################################
		// ##################################################
		// ################################## ROUND 8
		// Click "Save & Continue"
		
		await page.waitForSelector('.save-button');
		const buttons = await page.$$('.save-button');

		await buttons[1].click();	
		
		//#### LOG / DEBUG
		if(debug == true){	
			log.info('8. Clicked Save & Continue');
			html = await page.content();
			fs.writeFileSync(html_path + "_8_save_continue__" + Math.floor(new Date() / 1000) + ".html", html);
			page.screenshot({path: screenshot_path + "_8_save_continue_" + Math.floor(new Date() / 1000) + '.png'});
		}
		//#### LOG / DEBUG END
		
		await page.waitFor(500);		
		
		
		
		
		
		// ##################################################
		// ##################################################
		// ################################## ROUND 9
		// Click "Submit Order"
		
		if(buy == true){
			await buttons[2].click();
			
			//#### LOG / DEBUG
			if(debug == true){	
				log.info('9. Submitted Order');
				html = await page.content();
				fs.writeFileSync(html_path + "_9_submitted_order__" + Math.floor(new Date() / 1000) + ".html", html);
				page.screenshot({path: screenshot_path + "_9_submitted_order_" + Math.floor(new Date() / 1000) + '.png'});
			}
			//#### LOG / DEBUG END
			
			await page.waitFor(500);
			
		}
		
		await browser.close();
	})();
}

module.exports = runSnkrBot 
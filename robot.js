const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { By, Key, until } = webdriver;
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const ParamsIndices = {
  MANUFACTURER: 0,
  SCREEN_TYPE: 3,
};

async function runAutomatedTask(parameters) {
  let driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  try {
    await driver.get("http://localhost:3000/server/catalog-server.html");
    await driver.findElement(webdriver.By.name('importFromTXT')).click();
    driver.wait(until.elementIsVisible(driver.findElement(By.id("catalog")), 5000));
  }
  catch (e) {
    console.log(e)
  }
  
  setTimeout(async function() {
    await runServerTask(driver, parameters);
    setTimeout(async function() {
      await driver.get("http://localhost:3000/client/catalog-client.html");
      runClientTask(driver, parameters);
    }, 2000); 
  }, 2000);

}

async function runServerTask(driver, parameters) {
  try {
    previousScreenType = await driver.findElement(By.css(`#catalog tr:nth-child(${parameters.rowIndex}) td:nth-child(${ParamsIndices.SCREEN_TYPE + 2})`)).getText();
    previousManufacturer = await driver.findElement(By.css(`#catalog tr:nth-child(${parameters.rowIndex}) td:nth-child(${ParamsIndices.MANUFACTURER + 2})`)).getText();
  }
  catch (e) {
    console.log(e)
  }
  
  for(let i = 0; i < parameters.indices.length; i++) {
    try {
      const inputField = await driver.findElement(By.css(`#catalog tr:nth-child(${parameters.rowIndex}) td:nth-child(${parameters.indices[i] + 2})`));
      await inputField.click();
      await inputField.clear();
      await inputField.sendKeys(parameters.values[i]);
    }
    catch (e) {
      console.log(e)
    }
  }

  if(parameters.exportToXML) {
    try {
      await driver.findElement(webdriver.By.name('exportToXML')).click();
      await driver.wait(until.alertIsPresent());
      await driver.switchTo().alert().accept();
    }
    catch (e) {
      console.log(e)
    }
  }

  try {
    await driver.findElement(webdriver.By.name('exportToDB')).click();
    await driver.wait(until.alertIsPresent());
    await driver.switchTo().alert().accept();
  }
  catch (e) {
    console.log(e)
  }

}

async function runClientTask(driver, parameters) {
  let query;
  
  try {
    if(previousScreenType != '') { 
      query = `#screen-type-select>option[value='${previousScreenType}']`;
    }
    else {
      query = `#screen-type-select>option:last-child`;
    }

    await driver.findElement(webdriver.By.css(query)).click();
    await driver.findElement(webdriver.By.id('displayByScreenTypeButton')).click();
  }
  catch(e) {
    console.log(e)
  }
  
  try {
    if(previousManufacturer != '') {
        query = `#manufacturer-select>option[value='${previousManufacturer}']`;
    }
    else {
      query = `#manufacturer-select>option:last-child`;
    }

    await driver.findElement(webdriver.By.css(query)).click();
    await driver.findElement(webdriver.By.id('displayCountyByManufacturerButton')).click();
  }
  catch(e) {
    console.log(e)
  }

}

module.exports = {
    runAutomatedTask
};
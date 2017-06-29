process.env.NODE_ENV = process.env.NODE_ENV || 'TEST';
var db = require('../api/db.js');

describe("Test Pages", function() {

  beforeEach(function() {
    db.serialize(function() {
      db.run('DELETE FROM urls');
    });
  });

  var ROOT = "http://localhost:7777/#";

  function createUrlEntry(title, url) {
    browser.get(ROOT + "/new");
    element(by.model('formCtrl.form.title')).sendKeys(title);
    element(by.model('formCtrl.form.url')).sendKeys(url);
    return element(by.css('input[type=submit]')).click();
  }

  it('should have no listings on the index page and show a special message', function() {
    browser.get(ROOT + "/");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);

    expect(element.all(by.css('.empty-url-listing')).count()).toBe(1);
    expect(element(by.css('.empty-url-listing')).getText()).toMatch(/no URL listings/);
  });

  it('should create a new URL listing', function() {
    var customTitle = 'title-' + Math.random();
    var customUrl = 'http://my-new-website.com/' + Math.random();
    browser.get(ROOT + "/new");
    element(by.model('formCtrl.form.title')).sendKeys(customTitle);
    element(by.model('formCtrl.form.url')).sendKeys(customUrl);
    element(by.css('input[type=submit]')).click().then(function() {
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch(/#\/urls/);
        expect(element.all(by.css('.url-listing')).count()).toBe(1);
        expect(element(by.css('.url-listing .listing-title')).getText()).toContain(customTitle);
        expect(element(by.css('.url-listing .listing-url')).getText()).toContain(customUrl);
      });
    });
  });
          

  it('should search based off of the URL', function() {
    createUrlEntry("url one", "http://url-one.com");
    createUrlEntry("url two", "http://url-two.com");
    createUrlEntry("url three", "http://url-three.com");

    browser.get(ROOT + "/");
    expect(element.all(by.css('.url-listing')).count()).toBe(3);

    browser.get(ROOT + "/?q=one");
    expect(element.all(by.css('.url-listing')).count()).toBe(1);

    browser.get(ROOT + "/?q=x");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);
  });

  it('should edit created url', function() {

    var originalTitle = "url one";

    var originalUrl = "http://url-one.com";

    createUrlEntry(originalTitle, originalUrl);

    browser.get(ROOT + "/");

    expect(element(by.css('.url-listing .listing-title')).getText()).toContain(originalTitle);

    element(by.linkText('Edit')).click();

    expect(browser.getLocationAbsUrl()).toMatch(/#\/edit\/[0-9]{1}/);

    var editedTitle = 'edited';

    element(by.model('formCtrl.form.title')).clear();

    element(by.model('formCtrl.form.title')).sendKeys(editedTitle);

    element(by.css('input[type=submit]')).click();

    browser.get(ROOT + "/");

    expect(element(by.css('.url-listing .listing-title')).getText()).toContain(editedTitle);

    expect(element(by.css('.url-listing .listing-title')).getText()).not.toContain(originalTitle);

  });

  it('should edit created url', function() {

    createUrlEntry("url one", "http://url-one.com");

    browser.get(ROOT + "/");

    expect(element.all(by.css('.url-listing')).count()).toBe(1);

    browser.debugger();

    element(by.css('.btn-danger')).click();

    browser.get(ROOT + "/");

    expect(element.all(by.css('.url-listing')).count()).toBe(0);

  });

});

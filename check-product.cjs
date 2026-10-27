const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/sivab/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const section = fs.readFileSync('shopify/sections/main-product.liquid', 'utf8');
  const schema = JSON.parse(section.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const template = JSON.parse(fs.readFileSync('shopify/templates/product.json', 'utf8'));
  assert.equal(schema.settings.find(setting => setting.id === 'dynamic_checkout').default, true);
  assert.equal(template.sections.main.settings.dynamic_checkout, true);
  const browser = await chromium.launch({headless:true,channel:'chrome'});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [1440,390,320]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('file:///' + process.cwd().replaceAll('\\','/') + '/product-preview.html');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,`Overflow at ${width}`);
    assert.equal(await page.locator('.ak-related:not(.ak-bundle) .ak-related-card').count(),4);
    assert.equal(await page.locator('.ak-bundle-product').count(),4);
    assert.equal(await page.locator('.ak-bundle-add').count(),4);
    assert.deepEqual(
      await page.locator('.ak-bundle-add').evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label'))),
      [
        'Add Bantal Solis Eau de Parfum to bag',
        'Add Lumière Blanche Eau de Parfum to bag',
        'Add Veridian Mist Eau de Parfum to bag',
        'Add Flora Obscura Eau de Parfum to bag',
      ],
    );
    assert.deepEqual(
      await page.locator('.ak-related:not(.ak-bundle) .ak-related-image').evaluateAll(images => images.map(image => image.complete && image.naturalWidth > 0)),
      [true,true,true,true],
      `Recommendation images not loaded at ${width}`,
    );
    assert.deepEqual(
      await page.locator('.ak-bundle .ak-related-image').evaluateAll(images => images.map(image => image.complete && image.naturalWidth > 0)),
      [true,true,true,true],
      `Frequently bought together images not loaded at ${width}`,
    );
    await page.locator('.ak-bundle-add').first().click();
    assert.match(await page.locator('.ak-bundle-status').textContent(),/Design preview — add-to-cart/);
    await page.locator('label[for="preview-size-100"]').click();
    assert.equal(await page.locator('#preview-size-100').isChecked(),true);
    await page.getByRole('button',{name:'Increase quantity'}).click();
    assert.equal(await page.locator('[name=quantity]').inputValue(),'2');
    await page.getByRole('button',{name:'Decrease quantity'}).click();
    await page.getByRole('button',{name:'Decrease quantity'}).click();
    assert.equal(await page.locator('[name=quantity]').inputValue(),'1');
    await page.locator('summary').filter({hasText:'Shipping & delivery'}).click();
    assert.equal(await page.locator('details').filter({hasText:'Shipping & delivery'}).getAttribute('open'),'');
    await page.getByRole('button',{name:'Add to bag'}).click();
    assert.match(await page.locator('.ak-feedback').textContent(),/Design preview/);
    await page.getByRole('button',{name:'Buy now'}).click();
    assert.match(await page.locator('.ak-feedback').textContent(),/checkout is not connected/);
    if(width===1440) await page.screenshot({path:'product-preview-desktop.png',fullPage:true});
    if(width===390) await page.screenshot({path:'product-preview-mobile.png',fullPage:true});
  }
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS: section schema/template JSON, desktop/mobile overflow, quantity bounds, accordions, preview feedback, no browser JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});

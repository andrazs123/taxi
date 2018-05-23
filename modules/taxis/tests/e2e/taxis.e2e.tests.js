'use strict';

describe('Taxis E2E Tests:', function () {
  describe('Test Taxis page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/taxis');
      expect(element.all(by.repeater('taxi in taxis')).count()).toEqual(0);
    });
  });
});

'use strict';

describe('Najems E2E Tests:', function () {
  describe('Test Najems page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/najems');
      expect(element.all(by.repeater('najem in najems')).count()).toEqual(0);
    });
  });
});

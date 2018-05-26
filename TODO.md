- narediš najem: na roko vpišeš notr v bazo N najem za N avtov
- v taxi card details narediš klic na bazo, tabela najem, samo za ta id taxija in pobereš ven zadnji najem (datum_najema DESC)
   - varianta var car = query() -> car[0], druga da ima funkcijo queryOne
   https://docs.angularjs.org/api/ngResource/service/$resource
## - ura na vrhu v headerju (ali HH:mm trenutni čas)
- v taxis view dodaj $interval da se osvežuje na N sekund

za pon:
- modul za računanje zaslužka, svoj factory ki
  -- tukaj so tudi tarife notr
  -- dela poizvedba samo nad tabelo najem

ZA sreda:
  - prikaz taxi view, da je najet rdeč (ima gumb prekini), prost zelen (ima gumb najemi)

ZA četrtek:
  najems.client.service.js: prestavi v nek factory definicijo poti
  const protocol = 'http';
  const hostname = 'localhost';
  const port = '3000';


TODO ZASLUZEK OD NAJEMA SE UPOSTEVA!!!!
naredi najeme v bazi, da bojo nekateri avti imeli prekini eni pa najem

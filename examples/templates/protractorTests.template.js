describe("{$ doc.description $}", () => {
  let rootEl;
  beforeEach(() => {
    rootEl = browser.rootEl;{% if doc['ng-app-included'] %}
    browser.rootEl = '[ng-app]';{% endif %}
    browser.get("{$ doc.basePath $}{$ doc.example.deployments[doc.deployment.name].outputPath $}");
  });
  {% if doc['ng-app-included'] %}afterEach(() => { browser.rootEl = rootEl; });{% endif %}
{$ doc.innerTest $}
});
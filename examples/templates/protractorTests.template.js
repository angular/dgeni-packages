describe("{$ doc.example.id $}", function() {
  beforeEach(function() {
    browser.get("{$ doc.example.deployments[doc.deployment.name].outputPath $}");
  });

{$ doc.innerTest $}
});

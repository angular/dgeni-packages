var rewire = require('rewire');
var packageInfoFactory = rewire('./packageInfo.js');


describe("packageInfo", function() {
  var fs, path;

  beforeEach(function() {
    fs = packageInfoFactory.__get__('fs');
    path = packageInfoFactory.__get__('path');
    path.resolve = function() { return '' }
  });

  it('should read package.json as UTF-8', function() {
    fs.existsSync = function() { return true };
    spyOn(fs, 'readFileSync').and.returnValue('{}');

    packageInfoFactory();

    expect(fs.readFileSync).toHaveBeenCalledWith('package.json', 'UTF-8');
  });

  it('should return parsed file contents', function() {
    fs.existsSync = function() { return true };
    fs.readFileSync = function() { return '{"foo":"bar"}' };

    var packageInfo = packageInfoFactory();

    expect(packageInfo).toEqual({foo: "bar"});
  });

  it('should walk up the tree looking for jasmine', function() {
    fs.existsSync = function(file) {
      if (file == 'package.json') {
        return false;
      } else {
        return true;
      }
    }

    spyOn(fs, 'readFileSync').and.returnValue('{}');

    path.dirname = function() {
      return '../';
    }

    packageInfoFactory();

    expect(fs.readFileSync).toHaveBeenCalledWith('../package.json', 'UTF-8');
  });
});

const rewire = require('rewire');
var packageInfoFactory = rewire('./packageInfo.js');


describe("packageInfo", () => {
  let fs, path;

  beforeEach(() => {
    fs = packageInfoFactory.__get__('fs');
    path = packageInfoFactory.__get__('path');
    spyOn(path, 'resolve').and.returnValue('');
    spyOn(fs, 'existsSync').and.returnValue(true);
  });

  it('should read package.json as UTF-8', () => {
    spyOn(fs, 'readFileSync').and.returnValue('{}');

    packageInfoFactory();

    expect(fs.readFileSync).toHaveBeenCalledWith('package.json', 'UTF-8');
  });
  it('should return parsed file contents', () => {
    fs.existsSync.and.returnValue(true);
    spyOn(fs, 'readFileSync').and.returnValue('{"foo":"bar"}');

    const packageInfo = packageInfoFactory();

    expect(packageInfo).toEqual({foo: "bar"});
  });

  it('should walk up the tree looking for jasmine', () => {
    fs.existsSync.and.callFake(file => {
      if (file == 'package.json') {
        return false;
      } else {
        return true;
      }
    });

    spyOn(fs, 'readFileSync').and.returnValue('{}');
    spyOn(path, 'dirname').and.returnValue('../');

    packageInfoFactory();

    expect(fs.readFileSync).toHaveBeenCalledWith('../package.json', 'UTF-8');
  });
});

var decorateVersion = require('./decorateVersion')();
var semver = require('semver');

describe("decorateVersion", function() {
  it('should be a function', function() {
    expect(decorateVersion).toEqual(jasmine.any(Function));
  });

  it('should set the docsUrl', function() {
    var version = semver.parse('5.5.5');

    decorateVersion(version);
    expect(version.docsUrl).toBeDefined();
    expect(version.isOldDocsUrl).toBeUndefined();
  });

  describe('semantic version', function() {
    it('should be true for 1.2.0 not rc1 prerelease', function() {
      var version = semver.parse('1.2.0-build');
      expect(version.prerelease).toEqual(['build']);

      decorateVersion(version);

      expect(semver.parse(version.raw)).not.toEqual(null);
      expect(semver.parse(version.version)).not.toEqual(null);
    });

    it('should be true for 1.0.x w/o prerelease', function() {
      var version = semver.parse('1.0.0+rc1.build');

      decorateVersion(version);

      expect(semver.parse(version.raw)).not.toEqual(null);
      expect(semver.parse(version.version)).not.toEqual(null);
    });

    it('should be false for 1.0.x with prerelease', function() {
      var version = semver.parse('1.0.0-rc1.build');
      expect(version.prerelease).toEqual(['rc1', 'build']);

      decorateVersion(version);

      expect(semver.parse(version.raw)).toEqual(null);
      expect(semver.parse(version.version)).toEqual(null);
    });

    it('should be false for 1.2.0rc1', function() {
      var version = semver.parse('1.2.0-rc1.build');
      expect(version.prerelease).toEqual(['rc1', 'build']);

      decorateVersion(version);

      expect(semver.parse(version.raw)).toEqual(null);
      expect(semver.parse(version.version)).toEqual(null);
    });
  });

  describe('isOldDocsUrl', function() {
    it('should not be set for 1.0.2', function() {
      var version = semver.parse('1.0.2');
      decorateVersion(version);
      expect(version.isOldDocsUrl).toBeUndefined();
    });

    it('should be set for version < 1', function() {
      var version = semver.parse('0.0.2');
      decorateVersion(version);
      expect(version.isOldDocsUrl).toBe(true);
    });

    it('should be set for version < 1.0.2', function() {
      var version = semver.parse('1.0.1');
      decorateVersion(version);
      expect(version.isOldDocsUrl).toBe(true);
    });
  });
});

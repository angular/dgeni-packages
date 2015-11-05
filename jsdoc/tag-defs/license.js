var spdxLicenseList = require('spdx-license-list/spdx-full');

module.exports = function() {
  return {
    name: 'license',
    transforms: function(doc, tagName, value) {
      if (spdxLicenseList[value]) {
        doc.licenseDescription = spdxLicenseList[value];
      }
      return value;
    }
  };
};
var _ = require('lodash');

/**
 * A collection of tags that can be looked up by their tagDefinition.
 */
var TagCollection = function() {
  this.tags = [];
  this.tagsByName = Object.create(null);
  this.badTags = [];
  this.description = '';
};

TagCollection.prototype = {

  /**
   * Add a new tag to the collection.
   * @param {Tag} tag The tag to add
   */
  addTag: function(tag) {
    if ( !tag.errors ) {
      this.tags.push(tag);

      var tags = this.tagsByName[tag.tagDef.name] || [];
      tags.push(tag);
      this.tagsByName[tag.tagDef.name] = tags;

    } else {
      this.badTags.push(tag);
    }
  },

  /**
   * Remove a tag from the collection
   * @param  {Tag} tag The tag to remove
   */
  removeTag: function(tag) {
    _.remove(this.tags, tag);
    _.remove(this.tagsByName[tag.tagDef.name], tag);
  },

  /**
   * Get the first tag in the collection that has the specified tag definition
   * @param  {string} name The name of the tag definition whose tag we should get
   * @return {Tag}
   */
  getTag: function(name) {
    return this.getTags(name)[0];
  },

  /**
   * Get the tags in the collection that have the specified tag definition
   * @param  {string} name The name of the tag definition whose tags we should get
   * @return {Array}
   */
  getTags: function(name) {
    return this.tagsByName[name] || [];
  }

};


module.exports = TagCollection;
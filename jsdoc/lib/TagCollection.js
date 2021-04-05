/**
 * A collection of tags that can be looked up by their tagDefinition.
 */
class TagCollection {
  constructor(tags) {
    this.tags = [];
    this.tagsByName = new Map();
    this.badTags = [];
    this.description = '';
    (tags || []).forEach(tag => this.addTag(tag));
  }

  /**
   * Add a new tag to the collection.
   * @param {Tag} tag The tag to add
   */
  addTag(tag) {
    if ( !tag.errors && tag.tagDef ) {
      this.tags.push(tag);

      const tags = this.tagsByName.get(tag.tagDef.name) || [];
      tags.push(tag);
      this.tagsByName.set(tag.tagDef.name, tags);

    } else {
      this.badTags.push(tag);
    }
  }

  /**
   * Remove a tag from the collection
   * @param  {Tag} tag The tag to remove
   */
  removeTag(tag) {
    remove(this.tags, tag);
    remove(this.tagsByName.get(tag.tagDef.name), tag);
  }

  /**
   * Get the first tag in the collection that has the specified tag definition
   * @param  {string} name The name of the tag definition whose tag we should get
   * @return {Tag}
   */
  getTag(name) {
    return this.getTags(name)[0];
  }

  /**
   * Get the tags in the collection that have the specified tag definition
   * @param  {string} name The name of the tag definition whose tags we should get
   * @return {Array}
   */
  getTags(name) {
    return this.tagsByName.get(name) || [];
  }
}

function remove(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

module.exports = TagCollection;
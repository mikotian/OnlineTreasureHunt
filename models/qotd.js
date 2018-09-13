const { Model } = require('objection');

class Qotd extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'qotd';
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The colum(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return 'qid';
    }

}

module.exports = Qotd;
const { Model } = require('objection');

class Qotd_Ans extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'qotd_ans';
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The colum(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['qid', 'answer'],

            properties: {
                id: { type: 'string' },
                answer: { type: ['string', 'null'] },
            }
        };
    }

}

module.exports = Qotd_Ans;
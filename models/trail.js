const { Model } = require('objection');

class trail extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'trail';
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The colum(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return 'id';
    }


    // Optional JSON schema. This is not the database schema!
    // Nothing is generated based on this. This is only used
    // for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // http://json-schema.org/.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user', 'anstime', 'points'],

            properties: {
                id: { type: 'integer' },
                user: { type: 'string'},
                quesid: { type: 'string'},
                answer: { type: 'string'},
                anstime: { type: 'integer' },
                points: { type: 'number' }
            }
        };
    }
}

module.exports = trail;
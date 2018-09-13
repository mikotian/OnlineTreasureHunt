const { Model } = require('objection');

class jawaab extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'jawaab';
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
            required: ['ques', 'imgloc'],

            properties: {
                id: { type: 'integer' },
                ans: { type: ['string', 'null'] },
            }
        };
    }

    // This object defines the relations to other models.
    static get relationMappings() {
        // Import models here to prevent require loops.
        const koschan = require('./koschan');
        const teams = require('./teams');

        return {
            ans: {
                relation: Model.BelongsToOneRelation,
                // The related model. This can be either a Model
                // subclass constructor or an absolute file path
                // to a module that exports one.
                modelClass: koschan,
                join: {
                    from: 'koschan.id',
                    to: 'jawaab.id'
                }
            }
        };
    }
}

module.exports = jawaab;
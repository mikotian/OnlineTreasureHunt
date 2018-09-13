const { Model } = require('objection');

class Koschan extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'koschan';
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The colum(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return 'id';
    }

    // Methods can be defined for model classes just as you would for
    // any javascript class. If you want to include the result of these
    // method in the output json, see `virtualAttributes`.
    question() {
        return this.ques;
    }

    image() {
        return this.imgloc;
    }

    // Optional JSON schema. This is not the database schema!
    // Nothing is generated based on this. This is only used
    // for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // http://json-schema.org/.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'ques', 'imgloc', 'points', 'locationid'],

            properties: {
                id: { type: 'integer' },
                ques: { type: ['string', 'null'] },
                imgloc: { type: 'string', minLength: 1, maxLength: 255 },
                points: { type: 'number', minLength: 1, maxLength: 255 },
                locationid: { type: 'string' },
                lastans: { type: 'number' },
                level: {type: 'number'}
            }
        };
    }

    // This object defines the relations to other models.
    static get relationMappings() {
        // Import models here to prevent require loops.
        const jawaab = require('./jawaab');
        const teams = require('./teams');
        const locations = require('./locations');

        return {
            ans: {
                relation: Model.BelongsToOneRelation,
                // The related model. This can be either a Model
                // subclass constructor or an absolute file path
                // to a module that exports one.
                modelClass: jawaab,
                join: {
                    from: 'koschan.id',
                    to: 'jawaab.id'
                }
            },

            loc: {
                relation: Model.BelongsToOneRelation,
                modelClass: locations,
                join: {
                    from: 'koschan.locationid',
                    to: 'locations.id'
                }
            }
        };
    }
}

module.exports = Koschan;
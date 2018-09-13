const { Model } = require('objection');

class locations extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'locations';
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
    location() {
        return this.location;
    }

    // Optional JSON schema. This is not the database schema!
    // Nothing is generated based on this. This is only used
    // for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // http://json-schema.org/.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'location'],

            properties: {
                id: { type: 'string' },
                location: { type: ['string', 'null'] }
            }
        };
    }

    // This object defines the relations to other models.
    static get relationMappings() {
        // Import models here to prevent require loops.
        const users = require('./users');
        const teams = require('./teams');
        const koschan = require('./koschan');

        return {
            usersloc: {
                relation: Model.BelongsToOneRelation,
                // The related model. This can be either a Model
                // subclass constructor or an absolute file path
                // to a module that exports one.
                modelClass: users,
                join: {
                    from: 'users.locationid',
                    to: 'locations.id'
                }
            },

            quesloc: {
                relation: Model.HasManyRelation,
                modelClass: koschan,
                join: {
                    from: 'locations.id',
                    to: 'koschan.locationid'
                }
            },

            teamloc: {
                relation: Model.BelongsToOneRelation,
                modelClass: teams,
                join: {
                    from: 'koschan.locationid',
                    to: 'teams.locationid'
                }
            }
        };
    }
}

module.exports = locations;
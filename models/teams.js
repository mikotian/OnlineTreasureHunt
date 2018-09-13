const { Model } = require('objection');

class Teams extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'teams';
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

    logo() {
        return this.logo;
    }

    // Optional JSON schema. This is not the database schema!
    // Nothing is generated based on this. This is only used
    // for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // http://json-schema.org/.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'locationid', 'logo'],

            properties: {
                id: { type: 'integer' },
                locationid: { type: ['string', 'null'] },
                logo: { type: ['string', 'null'] }
            }
        };
    }

    // This object defines the relations to other models.
    static get relationMappings() {
        // Import models here to prevent require loops.
        const users = require('./users');
        const locations = require('./locations');
        const koschan = require('./koschan');

        return {
            teamloc: {
                relation: Model.BelongsToOneRelation,
                // The related model. This can be either a Model
                // subclass constructor or an absolute file path
                // to a module that exports one.
                modelClass: locations,
                join: {
                    from: 'teams.locationid',
                    to: 'locations.id'
                }
            }
        };
    }
}

module.exports = Teams;
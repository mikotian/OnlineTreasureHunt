const { Model } = require('objection');

class Users extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'users';
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
    fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    // Optional JSON schema. This is not the database schema!
    // Nothing is generated based on this. This is only used
    // for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // http://json-schema.org/.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'email'],

            properties: {
                id: { type: 'integer' },
                firstName: { type: 'string', minLength: 1, maxLength: 255 },
                lastName: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string', minLength: 1, maxLength: 255 },
                locationid: { type: 'string' },
                teamid: { type: 'string' },
                passw: { type: 'string' },
                lastans: { type: 'integer' }
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
 
            loc: {
                relation: Model.BelongsToOneRelation,
                modelClass: locations,
                join: {
                    from: 'users.locationid',
                    to: 'locations.id'
                }
            },

            team: {
                relation: Model.BelongsToOneRelation,
                modelClass: teams,
                join: {
                    from: 'users.teamid',
                    to: 'teams.teamid'
                }
            }
        };
    }
}

module.exports = Users;
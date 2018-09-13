const { Model } = require('objection');

class Users extends Model {

    // Table name is the only required property.
    static get tableName() {
        return 'userrank_mum';
    }

}
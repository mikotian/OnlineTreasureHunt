// run the following command to install:
// npm install objection knex sqlite3

const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'example.db'
  }
});

// Give the knex object to objection.
Model.knex(knex);

// Person model.
class Person extends Model {
  static get tableName() {
    return 'persons';
  }

  static get relationMappings() {
    return {
      children: {
        relation: Model.HasManyRelation,
        modelClass: Person,
        join: {
          from: 'persons.id',
          to: 'persons.parentId'
        }
      }
    };
  }
}

async function createSchema() {
  // Create database schema. You should use knex migration files to do this. We
  // create it here for simplicity.
await knex.schema.hasTable('persons').then(function(exists){
	if(!exists) {
 knex.schema.createTable('persons', table => {
    table.increments('id').primary();
    table.integer('parentId').references('persons.id');
    table.string('firstName');
  });
  }
  });
}

async function main() {
  // Create some people.
  /*const sylvester = await Person.query().insertGraph({
    firstName: 'Sylvester',

    children: [
      {
        firstName: 'Sage'
      },
      {
        firstName: 'Sophia'
      }
    ]
  });

  console.log('created:', sylvester);

  // Fetch all people named Sylvester and sort them by id.
  // Load `children` relation eagerly.
  const sylvesters = await Person.query()
    .where('firstName', 'Sylvester')
    .eager('children')
    .orderBy('id');

  console.log('sylvesters:', sylvesters);*/

    const bcrypt = require('bcrypt-nodejs');
    var salt = bcrypt.genSaltSync(10);
    var hasghed = bcrypt.hashSync("password", salt);
    console.log(hasghed);
    var ans = bcrypt.compareSync("password", "$2a$10$FwXO3KCWilof5D0KAQbZiO8oDQdyXbgxEEfg7cAQNi88byrNmynZO");

    console.log(ans);
}

createSchema().then(() => main()).catch(console.error);
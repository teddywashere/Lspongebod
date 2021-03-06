const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('./DatabaseModels/Warns')(sequelize, Sequelize.DataTypes);
require('./DatabaseModels/Setup')(sequelize, Sequelize.DataTypes);
require('./DatabaseModels/Tickets')(sequelize, Sequelize.DataTypes);
require('./DatabaseModels/jailmute')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);

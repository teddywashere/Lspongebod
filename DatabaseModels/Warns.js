module.exports = (sequelize, DataTypes) => {
	return sequelize.define('warns', {
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		warn: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
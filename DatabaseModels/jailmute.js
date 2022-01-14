module.exports = (sequelize, DataTypes) => {
	return sequelize.define('jailmute', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		jail_status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'false',
		},
        mute_status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'false',
		},
	});
};
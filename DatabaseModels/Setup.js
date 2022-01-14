module.exports = (sequelize, DataTypes) => {
	return sequelize.define('setup', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		owner_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		error_channel: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		co_owner: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		admin_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		staff_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		member_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		general_chat: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		ticket_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		ticketopen_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		ticketclose_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		ticket_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'number',
		},
		modlog_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		logs_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		criminals_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		jail_channel: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		jail_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		mute_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		chatreviver_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		everyone_role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		server_template: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		prefix: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '?',
		},
		client_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
	});
};

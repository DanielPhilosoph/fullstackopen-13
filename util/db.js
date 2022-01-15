const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const runMigrations = async () => {
  const migrator = new Umzug({
    // storage: new SequelizeStorage({ sequelize }),
    // storageOptions: {
    //   sequelize,
    //   tableName: "migrations",
    // },
    migrations: [
      {
        name: "initialize_blogs_and_users",
        async up({ context: queryInterface }) {
          await queryInterface.createTable("blogs", {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            author: {
              type: DataTypes.TEXT,
            },
            url: {
              type: DataTypes.TEXT,
              allowNull: false,
            },
            title: {
              type: DataTypes.TEXT,
              allowNull: false,
            },
            likes: {
              type: DataTypes.INTEGER,
              defaultValue: 0,
            },
            year: {
              type: DataTypes.INTEGER,
              defaultValue: 2000,
              allowNull: false,
            },
          });
          await queryInterface.createTable("users", {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            username: {
              type: DataTypes.STRING,
              unique: true,
              allowNull: false,
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            disabled: {
              type: DataTypes.BOOLEAN,
              allowNull: false,
            },
          });
          await queryInterface.addColumn("blogs", "user_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
          });
        },
        async down({ context: queryInterface }) {
          await queryInterface.dropTable("blogs");
          await queryInterface.dropTable("users");
        },
      },
      {
        name: "initialize_readying_list",
        async up({ context: queryInterface }) {
          await queryInterface.createTable("reading_lists", {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            user_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: { model: "users", key: "id" },
            },
            blog_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: { model: "blogs", key: "id" },
            },
            have_read: {
              type: DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
          });
        },
        async down({ context: queryInterface }) {
          await queryInterface.dropTable("reading_lists");
        },
      },
    ],
    context: sequelize.getQueryInterface(),
  });
  const migrations = await migrator.up();
  //const migrations = await migrator.down();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.file),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("database connected");
  } catch (err) {
    console.log("connecting database failed ", err);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };

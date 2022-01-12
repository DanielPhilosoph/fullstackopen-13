const Sequelize = require("sequelize");
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
    storage: new SequelizeStorage({ sequelize }),
    storageOptions: {
      sequelize,
      tableName: "migrations",
    },
    migrations: {
      path: `${process.cwd()}/migrations`,
      pattern: /\.js$/,
      glob: "migrations/*.js",
    },
    context: sequelize.getQueryInterface(),
  });
  const migrations = await migrator.up();
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

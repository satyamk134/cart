
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    emailId:{type: Sequelize.STRING},
    password:{type: Sequelize.STRING},
    lastName:{type: Sequelize.STRING},
    firstName:{type: Sequelize.STRING},
    role:{type: Sequelize.STRING, defaultValue:"customer"},
    address:{type: Sequelize.STRING},
    mobileNo:{type: Sequelize.STRING},
    provider:{type: Sequelize.STRING},
    
  });
  return User;
};  

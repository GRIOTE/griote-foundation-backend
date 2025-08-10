const sequelize = require('../config/db.config');
const Profile = require('./profile.model');
const Domain = require('./domain.model');
const Student = require('./student.model');
const Teacher = require('./teacher.model');
const Independent = require('./independent.model');

// Profile - Domain (N-N)
Profile.belongsToMany(Domain, { through: 'ProfileDomains', foreignKey: 'profileUserId' });
Domain.belongsToMany(Profile, { through: 'ProfileDomains', foreignKey: 'domainId' });

// Student - Domain (N-N)
Student.belongsToMany(Domain, { through: 'StudentDomains', foreignKey: 'studentUserId' });
Domain.belongsToMany(Student, { through: 'StudentDomains', foreignKey: 'domainId' });

// Teacher - Domain (N-N)
Teacher.belongsToMany(Domain, { through: 'TeacherDomains', foreignKey: 'teacherUserId' });
Domain.belongsToMany(Teacher, { through: 'TeacherDomains', foreignKey: 'domainId' });

// Independent - Domain (N-N)
Independent.belongsToMany(Domain, { through: 'IndependentDomains', foreignKey: 'independentUserId' });
Domain.belongsToMany(Independent, { through: 'IndependentDomains', foreignKey: 'domainId' });

// Relations one-to-one Profile -> Student/Teacher/Independent
Profile.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(Profile, { foreignKey: 'userId' });

Profile.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(Profile, { foreignKey: 'userId' });

Profile.hasOne(Independent, { foreignKey: 'userId' });
Independent.belongsTo(Profile, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Profile,
  Domain,
  Student,
  Teacher,
  Independent,
};

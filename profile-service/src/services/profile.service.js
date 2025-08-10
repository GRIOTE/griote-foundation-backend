const { Profile, Student, Teacher, Independent, Domain, sequelize } = require('../models');

class ProfileService {
  async getProfileByUserId(userId) {
    return Profile.findOne({
      where: { userId },
      include: [
        { model: Domain },
        { model: Student, include: [Domain] },
        { model: Teacher, include: [Domain] },
        { model: Independent, include: [Domain] },
      ],
    });
  }

  async createProfile(userId, profileData) {
    const transaction = await sequelize.transaction();
    try {
      const profile = await Profile.create({ userId, ...profileData }, { transaction });

      if (profileData.domainIds?.length) {
        const domains = await Domain.findAll({ where: { id: profileData.domainIds }, transaction });
        await profile.setDomains(domains, { transaction });
      }

      await this._handleSubProfiles(userId, profileData, transaction);

      await transaction.commit();

      return this.getProfileByUserId(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    const transaction = await sequelize.transaction();
    try {
      const profile = await Profile.findOne({ where: { userId }, transaction });
      if (!profile) throw new Error('Profile not found');

      await profile.update(profileData, { transaction });

      if (profileData.domainIds) {
        const domains = await Domain.findAll({ where: { id: profileData.domainIds }, transaction });
        await profile.setDomains(domains, { transaction });
      }

      await this._handleSubProfiles(userId, profileData, transaction, true);

      await transaction.commit();

      return this.getProfileByUserId(userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteProfile(userId) {
    const transaction = await sequelize.transaction();
    try {
      await Student.destroy({ where: { userId }, transaction });
      await Teacher.destroy({ where: { userId }, transaction });
      await Independent.destroy({ where: { userId }, transaction });
      await Profile.destroy({ where: { userId }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listProfiles(offset = 0, limit = 10) {
    return Profile.findAll({
      offset,
      limit,
      include: [
        { model: Domain },
        { model: Student, include: [Domain] },
        { model: Teacher, include: [Domain] },
        { model: Independent, include: [Domain] },
      ],
    });
  }

  // private
  async _handleSubProfiles(userId, profileData, transaction, isUpdate = false) {
    if (profileData.student) {
      let student = await Student.findOne({ where: { userId }, transaction });
      if (student && isUpdate) {
        await student.update(profileData.student, { transaction });
      } else if (!student) {
        await Student.create({ userId, ...profileData.student }, { transaction });
      }

      if (profileData.student.domainIds) {
        const domains = await Domain.findAll({ where: { id: profileData.student.domainIds }, transaction });
        student = student || await Student.findOne({ where: { userId }, transaction });
        await student.setDomains(domains, { transaction });
      }
    }

    if (profileData.teacher) {
      let teacher = await Teacher.findOne({ where: { userId }, transaction });
      if (teacher && isUpdate) {
        await teacher.update(profileData.teacher, { transaction });
      } else if (!teacher) {
        await Teacher.create({ userId, ...profileData.teacher }, { transaction });
      }

      if (profileData.teacher.domainIds) {
        const domains = await Domain.findAll({ where: { id: profileData.teacher.domainIds }, transaction });
        teacher = teacher || await Teacher.findOne({ where: { userId }, transaction });
        await teacher.setDomains(domains, { transaction });
      }
    }

    if (profileData.independent) {
      let independent = await Independent.findOne({ where: { userId }, transaction });
      if (independent && isUpdate) {
        await independent.update(profileData.independent, { transaction });
      } else if (!independent) {
        await Independent.create({ userId, ...profileData.independent }, { transaction });
      }

      if (profileData.independent.domainIds) {
        const domains = await Domain.findAll({ where: { id: profileData.independent.domainIds }, transaction });
        independent = independent || await Independent.findOne({ where: { userId }, transaction });
        await independent.setDomains(domains, { transaction });
      }
    }
  }
}

module.exports = new ProfileService();

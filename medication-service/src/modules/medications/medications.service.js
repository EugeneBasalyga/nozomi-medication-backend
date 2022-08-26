const {generateUUID} = require('../../../../shared/utils/utils');
const ApiError = require('../../../../shared/exceptions/ApiError');

class MedicationService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAllMedicationsByUserId(userId) {
    const medications = await this.repository.medication.findAllByUserId(userId);
    return medications;
  }

  async findUserMedicationById(id, userId) {
    const medication = await this.repository.medication.findByIdAndUserId(id, userId);
    if (!medication) {
      return null;
    }
    return medication;
  }

  async createMedication(medicationVO) {
    const medicationTO = {
      ...medicationVO,
      id: medicationVO.id ?? generateUUID(),
    };

    const createdMedicationTO = await this.repository.medication.create(medicationTO);
    const createdMedicationVO = {...createdMedicationTO};

    return createdMedicationVO;
  }

  async updateMedication(medicationVO) {
    const currentMedicationTO = await this.repository.medication
      .findByIdAndUserId(medicationVO.id, medicationVO.userId);
    if (!currentMedicationTO) {
      throw ApiError.NotFound(`Medication with id ${medicationVO.id} not found`);
    }

    const medicationTO = {
      ...currentMedicationTO,
      name: medicationVO.name !== undefined ? medicationVO.name : currentMedicationTO.name,
      description: medicationVO.description !== undefined
        ? medicationVO.description : currentMedicationTO.description,
      count: medicationVO.count !== undefined ? medicationVO.count : currentMedicationTO.count,
      destinationCount: medicationVO.destinationCount !== undefined
        ? medicationVO.destinationCount : currentMedicationTO.destinationCount,
    };

    const updatedMedicationTO = await this.repository.medication.update(medicationTO);
    const updatedMedicationVO = {...updatedMedicationTO};

    return updatedMedicationVO;
  }

  async deleteUserMedicationById(id, userId) {
    const currentMedicationTO = await this.repository.medication.findByIdAndUserId(id, userId);
    if (!currentMedicationTO) {
      throw ApiError.NotFound(`Medication with id ${id} not found`);
    }
    await this.repository.medication.deleteById(id);
  }
}

module.exports = MedicationService;

const BaseController = require('../../../../shared/classes/BaseController');
const validationSchemas = require('../../validators/schemas');
const validate = require('../../../../shared/middleware/validationMiddleware');
const verifyAccessToken = require('../../middleware/verifyAccessToken');
const ApiError = require('../../../../shared/exceptions/ApiError');
const paramIdValidator = require('../../../../shared/validators/paramId');

class MedicationController extends BaseController {
  constructor(service) {
    super(service);

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);

    this.router.get(
      '/',
      verifyAccessToken,
      this.getAll,
    );

    this.router.get(
      '/:id',
      verifyAccessToken,
      validate([paramIdValidator('id')]),
      this.getById,
    );

    this.router.post(
      '/',
      verifyAccessToken,
      validate([
        validationSchemas.medication,
      ]),
      this.create,
    );

    this.router.put(
      '/:id',
      verifyAccessToken,
      validate([paramIdValidator('id')]),
      (req, __res, next) => {
        if (req.params.id !== req.body.id) {
          return next(ApiError.BadRequest());
        }

        return next();
      },
      validate([
        validationSchemas.medication,
      ]),
      this.put,
    );

    this.router.patch(
      '/:id',
      verifyAccessToken,
      validate([paramIdValidator('id')]),
      (req, __res, next) => {
        if (req.params.id !== req.body.id) {
          return next(ApiError.BadRequest());
        }

        return next();
      },
      this.patch,
    );

    this.router.delete(
      '/:id',
      verifyAccessToken,
      validate([paramIdValidator('id')]),
      this.delete,
    );
  }

  async getAll(req, res, next) {
    const userId = req.user.id;
    try {
      const userMedications = await this.service.medication.findAllMedicationsByUserId(userId);
      return res.status(200).json(userMedications);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    const userId = req.user.id;
    const {id} = req.params;

    try {
      const userMedication = await this.service.medication
        .findMedicationByUserId(id, userId);
      if (!userMedication) {
        return next(ApiError.NotFound(`Medication by id ${id} not found`));
      }
      return res.status(200).json(userMedication);
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    const userId = req.user.id;
    const medication = {
      ...req.body,
      userId,
    };
    try {
      const createdMedication = await this.service.medication.createMedication(medication);
      return res.status(201).json(createdMedication);
    } catch (err) {
      return next(err);
    }
  }

  async put(req, res, next) {
    try {
      const medication = await this.service.medication.updateMedication(req.body);
      return res.status(200).json(medication);
    } catch (err) {
      return next(err);
    }
  }

  async patch(req, res, next) {
    const userId = req.user.id;
    const medication = {
      ...req.body,
      userId,
    };

    try {
      const updatedMedication = await this.service.medication.updateMedication(medication);
      return res.status(200).json(updatedMedication);
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    const userId = req.user.id;
    const {id} = req.params;

    try {
      await this.service.medication.deleteMedicationById(id, userId);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = MedicationController;

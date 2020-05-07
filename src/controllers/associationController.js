import models from '../models';
import { ErrorHandler } from '../helpers/error';

const { Association, Community } = models;

const findAssociationByPk = async (associationId) => {
  try {
    const association = await Association.findByPk(associationId);
    if (!association) {
      throw new ErrorHandler(404, 'The association with that Id is not found');
    }
    return association;
  } catch (err) {
    throw new Error(err);
  }
};

const Associations = {
  /**
   *  Create an Association
   * @param {object} param0
   * @param {object} res
   * @param {function} next
   */
  async create(req, res, next) {
    const { name, description, image } = req.body;
    const { communityId } = req.decoded;

    try {
      // A user needs to join a community before he/she can create an assiation
      if (!communityId) {
        throw new ErrorHandler(400, 'You must be part of a community to create an association');
      }
      const community = await Community.findByPk(communityId);
      if (!community) {
        throw new ErrorHandler(404, 'Your community is not in our database');
      }
      const association = await Association.create({
        chairman: req.decoded.name,
        name,
        description,
        image,
        communityId
      });
      return res.status(201).send({ association });
    } catch (err) {
      return next(err);
    }
  },

  async fetchAll(req, res, next) {
    try {
      // Write your code here
      return res.status(200).send({});
    } catch (err) {
      return next(err);
    }
  },

  async fetchOne({ params }, res, next) {
    const { associationId } = params;

    try {
      const association = await findAssociationByPk(associationId);
      return res.status(200).send({ association });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      // write your code here
      return res.status(200).send({});
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    try {
      // Write your code here
      return res.status(200).send({});
    } catch (err) {
      return next(err);
    }
  }
};

export default Associations;
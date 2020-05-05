import models from '../models';
import { ErrorHandler } from '../helpers/error';

const { Community } = models;

const Communities = {
  /**
   *  Create a community
   * @param {object} param0
   * @param {object} res
   * @param {function} next
   */
  async create({ body }, res, next) {
    const { name, description, image } = body;

    try {
      const community = await Community.create({ name, description, image });
      return res.status(201).send({ community });
    } catch (err) {
      return next(err);
    }
  },

  async fetchAll(req, res, next) {
    try {
      const communities = await Community.findAll();
      return res.status(200).send({ communities });
    } catch (err) {
      return next(err);
    }
  },

  async fetchOne({ params }, res, next) {
    const { communityId } = params;

    try {
      const community = await Community.findByPk(communityId);

      if (!community) {
        throw new ErrorHandler(404, 'The community with that Id is not found');
      }
      return res.status(200).send({ community });
    } catch (err) {
      return next(err);
    }
  },

  async update({ params, body }, res, next) {
    const { communityId } = params;
    const { name, description, image } = body;

    try {
      const community = await Community.findByPk(communityId);

      if (!community) {
        throw new ErrorHandler(404, 'The community with that Id is not found');
      }

      const updatedCommunity = await community.update({
        name: name || community.name,
        description: description || community.description,
        image: image || community.image
      });
      return res.status(200).send({ community: updatedCommunity });
    } catch (err) {
      return next(err);
    }
  },

  async delete({ params }, res, next) {
    const { communityId } = params;

    try {
      const community = await Community.findByPk(communityId);

      if (!community) {
        throw new ErrorHandler(404, 'The community with that Id is not found');
      }

      await community.destroy();
      return res.status(200).send({});
    } catch (err) {
      return next(err);
    }
  }
};

export default Communities;

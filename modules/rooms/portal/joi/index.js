const Joi = require("joi");
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, "hexadecimal");

module.exports = {
  getAllAvailableRoomsSchema: {
    query: Joi.object({
      page: Joi.number(),
      size: Joi.number(),
      capacity: Joi.number(),
      startDate: Joi.date()
        .max(Joi.ref("endDate")) // Ensure startDate is before endDate
        .when("endDate", { is: Joi.exist(), then: Joi.required() }),

      endDate: Joi.date(), // Ensure endDate is after startDate
    }),
  },
  getRoomDetailsSchema: {
    params: Joi.object({
      _id: objectIdSchema.required(),
    }),
  },
};

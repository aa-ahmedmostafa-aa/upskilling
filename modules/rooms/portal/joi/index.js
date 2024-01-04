const Joi = require("joi");

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
};

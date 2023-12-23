const { PAGE_LIMIT } = require("../constants");

const paginationService = (page, size) => {
  page = parseInt(page);
  size = parseInt(size);

  if (!page || page <= 0) {
    page = 1;
  }
  if (!size) {
    size = PAGE_LIMIT;
  }
  const limit = parseInt(size);
  const offset = (page - 1) * size;

  return { limit, offset };
};

module.exports = paginationService;

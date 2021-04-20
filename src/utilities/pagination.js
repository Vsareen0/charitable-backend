/* Pagination */
module.exports = (count, page, limit = 5) => {
  let maxPages = Math.floor(count / limit) + 1;
  let offset = 0;

  if (page > maxPages) {
    return {
      maxPages,
      canPaginate: false,
    };
  }

  if (page > 1) {
    offset = page * limit - limit;
  }

  return {
    limit,
    offset,
    maxPages,
    canPaginate: true,
  };
};

/** Pagination ends here */

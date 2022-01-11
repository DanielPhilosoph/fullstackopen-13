function isNumber(param) {
  if (!isNaN(param)) {
    return true;
  }
  return false;
}

module.exports = { isNumber };

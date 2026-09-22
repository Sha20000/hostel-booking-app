const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !isValidEmail(email)) errors.push('A valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

const validateLoginInput = ({ email, password }) => {
  const errors = [];
  if (!email || !isValidEmail(email)) errors.push('A valid email is required');
  if (!password) errors.push('Password is required');
  return errors;
};

module.exports = { validateRegisterInput, validateLoginInput };

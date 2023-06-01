export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePhone = (phone) => {
  return /^(\+?\d{1,3}[-.\s]?)?(\(\d{1,3}\)|\d{1,3})[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(phone);
};

export const validateAddress = (address) => {
  return address.trim() !== '';
};

export const validateName = (name) => {
  return name.trim() !== '';
};

require("dotenv").config();


function formatImages(obj, baseUrl) {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => formatImages(item, baseUrl));
  }

  if (typeof obj === 'object') {
    for (const key in obj) {
      const value = obj[key];

      if (
        typeof value === 'string' &&
        value.startsWith('/uploads/') // ONLY backend uploads
      ) {
        obj[key] = `${baseUrl}${value}`;
      } else if (typeof value === 'object') {
        formatImages(value, baseUrl);
      }
    }
  }

  return obj;
}

const responseFormatter = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const baseUrl = process.env.BACKEND_URL;
    formatImages(data, baseUrl);
    return originalJson.call(this, data);
  };

  next();
};

module.exports = responseFormatter;
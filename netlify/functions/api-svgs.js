const icons = require('../../dist/icons.json');

exports.handler = async (_event, _context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(icons),
  };
};

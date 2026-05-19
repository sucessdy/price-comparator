// // middleware/requestId.js
// const { v4: uuidv4 } = require('uuid');

// const requestId = (req, res, next) => {
//   req.id = uuidv4();
//   res.setHeader('X-Request-Id', req.id);
//   next();
// };

// // In app.js
// app.use(requestId);
// app.use(errorHandler);
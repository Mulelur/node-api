const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`node srever running on port: ${port}`);
});

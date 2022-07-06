const express = require('express')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

app.use( require('./routes/paymentRouter'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
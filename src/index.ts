import express from 'express';

const app = express();

app.get('/health',
    (req
     , res) => {
                    res.send('I am alive')
});

app.listen(3040, () => {
  console.log('The application is listening on port 3040!');
});

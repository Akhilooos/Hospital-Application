const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const util = require('util');

const router = express.Router(); // Router level middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const filePath = `${__dirname}/../data.json`;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// GET
router.get('/', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.hospitalData);
  } catch (error) {
    console.error('Error reading or parsing JSON:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST
router.post('/add', async (req, res) => {
  try {
    const newData = req.body;
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    jsonData.hospitalData.push(newData);

    await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.send('Data posted');
  } catch (error) {
    console.error('Error reading, updating, or parsing JSON:', error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT
//http://localhost:3000/api/update/id id is the index of the field you want to update 
router.put('/update/:id', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const hospitalId = parseInt(req.params.id);

    if (hospitalId >= 0 && hospitalId < jsonData.hospitalData.length) {
      const updatedData = req.body;
      jsonData.hospitalData[hospitalId] = { ...jsonData.hospitalData[hospitalId], ...updatedData };

      await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.send('Data updated');
    } else {
      res.status(404).json({ error: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error updating JSON:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE
router.delete('/remove', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    if (jsonData.hospitalData.length > 0) {
      const removedHospital = jsonData.hospitalData.pop();

      await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.send('Data removed');
    } else {
      res.status(404).json({ error: 'No hospitals to remove' });
    }
  } catch (error) {
    console.error('Error removing data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;




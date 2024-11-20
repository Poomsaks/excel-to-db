const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./db');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
  
      for (const row of data) {
        const { 
          fullname, 
          sex, 
          ages, 
          height_cm, 
          weight, 
          changwatcode, 
          ampurcodefull, 
          tamboncodefull, 
          moo, 
          address, 
          carbEvents, 
          bmr, 
          tdee, 
          carb2day, 
          at_datetime 
        } = row;
  
        // Replace undefined values with null
        const values = [
          fullname ?? null, 
          sex ?? null, 
          ages ?? null, 
          height_cm ?? null, 
          weight ?? null, 
          changwatcode ?? null, 
          ampurcodefull ?? null, 
          tamboncodefull ?? null, 
          moo ?? null, 
          address ?? null, 
          carbEvents ?? null, 
          bmr ?? null, 
          tdee ?? null, 
          carb2day ?? null, 
          at_datetime ?? null
        ];
  
        await db.execute(
          `INSERT INTO lowcarb (
            fullname, 
            sex, 
            ages, 
            height_cm, 
            weight, 
            changwatcode, 
            ampurcodefull, 
            tamboncodefull, 
            moo, 
            address, 
            carbEvents, 
            bmr, 
            tdee, 
            carb2day, 
            at_datetime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          values
        );
      }
  
      res.status(200).send('Data imported successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred!');
    }
  });
  
 

module.exports = router;

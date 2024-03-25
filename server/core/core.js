"use strict"
const fs = require("fs");
const { uploadUserData, fetchUserStats } = require("./../dbModels/users");

exports.csv_to_json = async (req, res) => {
    try {
      if (!req.body || !req.body.file_path) {
        return res.status(400).json({
          status_code: 400,
          message: "Invalid request body"
        });
      }
      const csvFilePath = req.body.file_path;
      const fileData = fs.readFileSync(csvFilePath, 'utf-8');
      const rows = fileData.split('\n').map(row => row.split(','));
      const jsonData = parseCSV(rows);
      const isUploadSuccessful = await uploadUserData(jsonData);
      if (isUploadSuccessful){
        const userStatsData = await fetchUserStats();
        console.table(userStatsData);
      }else{
        throw new Error("Failed to upload CSV data to database");
      }
      return res.status(200).json({ 
          status_code: 200,
          message: 'CSV data converted to JSON and uploaded to database' 
      });
    }catch(error) {
      console.error("Error: ", error);
      return res.status(500).json({
        error: 'Failed to process CSV data' 
      });
    }
  }


  function parseCSV(fileData) {
    const headers = fileData.shift().map(header => header.trim());
    const data = fileData.map(row => {
      const parsedRow = {};
      headers.forEach((header, index) => {
        if (row && row[index]){
        const parts = header.split('.');
        const value = row[index].trim();
        let current = parsedRow;
        parts.forEach((part, i) => {
          if (i === parts.length - 1) {
            current[part] = value;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
        }
      });
      return parsedRow;
    });
    const cleanData = data.filter(record => Object.keys(record).length > 0);
    return cleanData;
  }
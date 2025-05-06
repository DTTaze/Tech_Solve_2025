const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");



const identifyImage = async (fileBuffer, fileName) => {
    const form = new FormData();
    form.append("image", fileBuffer, fileName); 
  
    try {
      const response = await axios.post("http://python:5000/predict", form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error identifying image:", error.message);
      throw error;
    }
}

module.exports = {
    identifyImage
}
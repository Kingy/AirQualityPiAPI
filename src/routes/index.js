const express = require('express');
const router = express.Router();
const pms5003Controller = require('../controllers/pms5003Controller');
const bme680Controller = require('../controllers/bme680Controller');

router.post('/pms5003', pms5003Controller.postData);
router.post('/bme680', bme680Controller.postData);
router.get('/pms5003/latest', pms5003Controller.getLatestData);
router.get('/pms5003/last24hours', pms5003Controller.getDataLast24Hours);
router.get('/pms5003/maxPM10', pms5003Controller.getMaxPM10PerDay);
router.get('/pms5003/avgPM10', pms5003Controller.getAveragePM10PerDay);
router.get('/pms5003/data', pms5003Controller.getData);
router.get('/bme680/latest', bme680Controller.getLatestData);
router.get('/bme680/last24hours', bme680Controller.getDataLast24Hours);
router.get('/bme680/data', bme680Controller.getData);

module.exports = router;


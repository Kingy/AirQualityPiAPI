const Pms5003 = require('../models/Pms5003');
const { Op, fn, col } = require('sequelize');

exports.postData = async (req, res) => {
    const { PM1_0, PM2_5, PM10 } = req.body;

    try {
        const data = await Pms5003.create({
            PM1_0,
            PM2_5,
            PM10
        });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getLatestData = async (req, res) => {
    try {
        const data = await Pms5003.findOne({ order: [['createdAt', 'DESC']] });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getDataLast24Hours = async (req, res) => {
    const date = new Date();
    date.setHours(date.getHours() - 24);

    try {
        const data = await Pms5003.findAll({
            where: {
                createdAt: {
                    [Op.gt]: date
                }
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getMaxPM10PerDay = async (req, res) => {
    try {
        const data = await Pms5003.findAll({
            attributes: [
                [fn('date', col('createdAt')), 'date'],
                [fn('max', col('PM10')), 'maxPM10']
            ],
            group: ['date'],
            order: [['date', 'ASC']],
        });

        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (error) {
	 console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the data.'
        });
    }
};

exports.getAveragePM10PerDay = async (req, res) => {
    try {
        const data = await Pms5003.findAll({
            attributes: [
                [fn('date', col('createdAt')), 'date'],
                [fn('avg', col('PM10')), 'averagePM10']
            ],
            group: ['date'],
            order: [['date', 'ASC']],
        });

        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the data.'
        });
    }
};

exports.getData = async (req, res) => {
    try {
        const type = req.query.type;
        if (!['PM10', 'PM2_5', 'PM1_0'].includes(type)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid type. Type should be temperature, humidity, or pressure.'
            });
        }

        const last24HoursData = await getLast24HoursData(type);
        const minMaxData = await getMinMaxData(type);
        const latestDataPoint = await getLatestDataPoint(type);

        res.status(200).json({
            status: 'success',
            last24HoursData,
            minMaxData,
            latestDataPoint
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the data.'
        });
    }
};

const getLast24HoursData = async (type) => {
    return await Pms5003.findAll({
        attributes: ['createdAt', type],
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
        },
        order: [['createdAt', 'ASC']]
    });
};

const getMinMaxData = async (type) => {
    return await Pms5003.findAll({
        attributes: [
            [fn('date', col('createdAt')), 'date'],
            [fn('min', col(type)), 'min'],
            [fn('max', col(type)), 'max']
        ],
        group: ['date'],
        order: [['date', 'ASC']]
    });
};

const getLatestDataPoint = async (type) => {
    return await Pms5003.findAll({
        attributes: ['createdAt', type],
        order: [['createdAt', 'DESC']],
        limit: 1
    });
};

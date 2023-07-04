const Bme680 = require('../models/Bme680');
const { fn, col, Op, literal } = require('sequelize');

exports.postData = async (req, res) => {
    const { Temperature, Pressure, Humidity, Altitude } = req.body;

    try {
        const data = await Bme680.create({
            Temperature,
            Pressure,
            Humidity,
            Altitude
        });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
	console.log(err.message)
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getLatestData = async (req, res) => {
    try {
        const data = await Bme680.findOne({ order: [['createdAt', 'DESC']] });

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
    try {
        const date = new Date();
        date.setDate(date.getDate() - 1);  // 24 hours ago

        const data = await Bme680.findAll({
            where: {
                createdAt: {
                    [Op.gt]: date
                }
            },
            order: [
                ['createdAt', 'ASC']
            ]
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
        if (!['Temperature', 'Humidity', 'Pressure'].includes(type)) {
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
    return await Bme680.findAll({
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
    return await Bme680.findAll({
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
    return await Bme680.findAll({
        attributes: ['createdAt', type],
        order: [['createdAt', 'DESC']],
        limit: 1
    });
};

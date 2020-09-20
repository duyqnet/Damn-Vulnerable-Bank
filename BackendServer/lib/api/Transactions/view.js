var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateUserToken } = require("../../../middlewares/validateToken");
const { Op } = require("sequelize");

/**
 * Transactions viewing route
 * This endpoint allows to view all transactions of authorized user
 * @path                             - /api/transactions/view
 * @middleware
 * @return                           - Status
 */
router.post('/', validateUserToken, (req, res) => {
    var r = new Response();
    let { account_number } = req;
    Model.transactions.findAll({
        where: {
            [Op.or]: [
                { from_account: account_number },
                { to_account: account_number }
            ],
        },
        attributes: ["from_account", "to_account", "amount"]
    }).then((transactions) => {
        r.status = statusCodes.SUCCESS;
        r.data = transactions;
        return res.json(r);
    }).catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "error": err.toString()
        };
        return res.json(r);
    });
});

module.exports = router;
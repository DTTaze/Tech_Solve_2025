const express = require('express');
const router = express.Router();
const middlewareImage = require('../middlewares/middlewareImage');

const eventController = require('../controllers/eventController');
const checkPermission = require('../middlewares/checkPermission');

router.get('/:event_id',
    // checkPermission('read', 'event'),
    eventController.handleGetEventbyId
);

router.get('/',
    // checkPermission('read', 'event'),
    eventController.handleGetAllEvents
);

router.post('/create',
//   checkPermission('create', 'event'),
    middlewareImage.array('images',5),
    eventController.handleCreateEvent
);

module.exports = router;
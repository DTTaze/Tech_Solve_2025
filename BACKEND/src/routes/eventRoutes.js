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

router.get('/user/:user_id',
    // checkPermission('read', 'event'),
    eventController.handleGetEventByUserId
);

router.post('/create',
//   checkPermission('create', 'event'),
    middlewareImage.array('images',5),
    eventController.handleCreateEvent
);

router.post('/accept/:event_id',
    // checkPermission('update', 'event'),
    eventController.handleAcceptEvent
);

module.exports = router;
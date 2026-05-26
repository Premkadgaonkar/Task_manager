const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAnalytics,
  getSuggestions,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/suggestions', getSuggestions);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;

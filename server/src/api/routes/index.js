const express = require('express');
const router = express.Router();

const addressRoutes = require('./address.routes');
const adminsRoutes = require('./admins.routes');
const attackFormsRoutes = require('./attack-forms.routes');
const attackFormsDanRelevanceRoutes = require('./attack-forms-dan-relevance.routes');
const clubsRoutes = require('./clubs.routes');
const danGradesRoutes = require('./dan-grades.routes');
const gradesRoutes = require('./grades.routes');
const imagesRoutes = require('./images.routes');
const linksRoutes = require('./links.routes');
const milestonesRoutes = require('./milestones.routes');
const recommendationsRoutes = require('./recommendations.routes');
const seminarsRoutes = require('./seminars.routes');
const techniquesRoutes = require('./techniques.routes');
const techniquesDanRelevanceRoutes = require('./techniques-dan-relevance.routes');
const workFormsRoutes = require('./work-forms.routes');
const loginRoutes = require('./login.routes');
const passwordResetRoutes = require('./password-reset.routes');
const passwordChangeRoutes = require('./password-change.routes');
const emailChangeRoutes = require('./email-change.routes');
const storiesRoutes = require('./stories.routes');
const divRelevanceRoutes = require('./div-relevance.routes');
const homeDataRoutes = require('./home-data.routes');

// Routes API
router.use('/address', addressRoutes);
router.use('/admins', adminsRoutes);
router.use('/attackForms', attackFormsRoutes);
router.use('/attackFormsDanRelevance', attackFormsDanRelevanceRoutes);
router.use('/clubs', clubsRoutes);
router.use('/danGrades', danGradesRoutes);
router.use('/grades', gradesRoutes);
router.use('/images', imagesRoutes);
router.use('/links', linksRoutes);
router.use('/milestones', milestonesRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/seminars', seminarsRoutes);
router.use('/techniques', techniquesRoutes);
router.use('/techniquesDanRelevance', techniquesDanRelevanceRoutes);
router.use('/workForms', workFormsRoutes);
router.use('/login', loginRoutes);
router.use('/passwordReset', passwordResetRoutes);
router.use('/passwordChange', passwordChangeRoutes);
router.use('/emailChange', emailChangeRoutes);
router.use('/stories', storiesRoutes);
router.use('/divRelevance', divRelevanceRoutes);
router.use('/homeData', homeDataRoutes);

// Route de base pour vérifier que l'API fonctionne
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API Aikido fonctionnelle' });
});

module.exports = router;
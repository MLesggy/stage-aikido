const db = require('../config/database');

// Export des modèles
module.exports = {
  addressModel: require('./address.model')(db),
  adminsModel: require('./admins.model')(db),
  attackFormsDanRelevanceModel: require('./attack-forms-dan-relevance.model')(db),
  attackFormsModel: require('./attack-forms.model')(db),
  clubSchedulesModel: require('./club-schedules.model')(db),
  clubsModel: require('./clubs.model')(db),
  danGradesModel: require('./dan-grades.model')(db),
  gradesModel: require('./grades.model')(db),
  imagesModel: require('./images.model')(db),
  linksModel: require('./links.model')(db),
  milestonesModel: require('./milestones.model')(db),
  recommendationsModel: require('./recommendations.model')(db),
  seminarsModel: require('./seminars.model')(db),
  techniquesDanRelevanceModel: require('./techniques-dan-relevance.model')(db),
  techniquesModel: require('./techniques.model')(db),
  workFormsModel: require('./work-forms.model')(db),
  loginModel: require('./logins.model')(db),
  passwordResetModel: require('./password-reset.model')(db),
  passwordChangeModel: require('./password-change.model')(db),
  emailChangeModel: require('./email-change.model')(db),
  storiesModel: require('./stories.model')(db),
  divRelevanceModel: require('./div-relevance.model')(db),
  homeDataModel: require('./home-data.model')(db),
};
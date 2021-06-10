const Scheme = require('./scheme-model');
const db = require('../../data/db-config');

const checkSchemeId = async (req, res, next) => {
  try {
    const existing = await db('schemes')
      .where('scheme_id', req.params.scheme_id)
      .first()

    if (!existing) {
      next({
        status: 404,
        message: `scheme with scheme_id ${req.params.scheme_id} not found`
      })
    } else {
      next()
    }
  } catch (err) {
      next(err)
  }
  // const { scheme_id } = req.params
  // Scheme.findById(scheme_id)
  //   .then(scheme => {
  //     if (!scheme) {
  //       next({
  //         status: 404,
  //         message: `scheme with scheme_id ${scheme_id} not found`
  //       })
  //     } else {
  //       req.scheme = scheme;
  //       next()
  //     }
  //   })
  //   .catch(next)
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;
  if (
    scheme_name == undefined 
    || scheme_name == ''
    || typeof(scheme_name) !== 'string'
  ) {
    next({
      status: 400,
      message: 'invalid scheme_name'
    })
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (
    instructions == undefined 
    || instructions === ''
    || typeof(instructions) !== 'string'
    || typeof(step_number) !== 'number'
    || step_number < 1
    ) {
    next({
      status: 400,
      message: 'invalid step'
    })
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}

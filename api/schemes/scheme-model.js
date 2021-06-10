const db = require('../../data/db-config');

function find() {
  return db.select('sc.*')
    .from('schemes as sc')
    .count('st.step_id as number_of_steps')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id');
}

async function findById(scheme_id) {
  const scheme = await db.select('sc.scheme_name', 'st.*')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number');

    const schemeSteps = scheme.map(singleScheme => {
        return {
          step_id: singleScheme.step_id,
          step_number: singleScheme.step_number,
          instructions: singleScheme.instructions
        }
    });

    const organizedScheme = {
      scheme_id: scheme[0].scheme_id,
      scheme_name: scheme[0].scheme_name,
      steps: schemeSteps[0].step_id == null ? [] : schemeSteps,
    };

    return organizedScheme;
}

async function findSteps(scheme_id) {
  const scheme = await db.select('sc.scheme_name', 'st.*')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'decs');

    return scheme[0].step_id == null ? [] : scheme;
}

async function add(scheme) { // EXERCISE D
  const [id] = await db('schemes').insert(scheme);

  return db('schemes').where('scheme_id', id).first();
  /*P
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

async function addStep(scheme_id, step) { 
  const newStep = {...step, scheme_id: scheme_id};
  await db('steps').insert(newStep);

  return findSteps(scheme_id);


  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}

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
  const steps = await db
    .select('st.step_id', 'st.step_number', 'instructions', 'scheme_name')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .groupBy('st.step_number');


  return steps;
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

    select st.step_id, st.step_number, instructions, scheme_name
    from schemes as sc
    left join steps as st 
      on sc.scheme_id = st.scheme_id
    group by st.step_number;

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
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

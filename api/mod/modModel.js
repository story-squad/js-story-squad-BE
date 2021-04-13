const db = require('../../data/db-config');
const { dbOps, formatCohortSubmissions } = require('../../lib');
const faceoff = require('./faceoffGeneration');
const { result, clusterGeneration } = require('./modHelpers');
const ballot = require('./BallotGeneration');
const Children = require('../child/childModel');
const { testUserSubmissions } = require('../../data/modData');

/**
 * Queries the database for a list of all current cohorts
 * @returns {Promise} returns a promise that resolves to a list of cohort objects
 */
const getCohorts = () => {
  return db('Cohorts');
};

/**
 * Attempts to add another cohort to the database
 * @param {Object} cohort a cohort object (or array of cohorts) to be added
 * @param {number} cohort.StoryID the id of the cohort's curernt story
 * @return {Promise} returns a promise that resolves to the ID(s) of the new cohort(s)
 */
const addCohort = (cohort) => {
  return db('Cohorts').insert(cohort).returning('ID');
};

/**
 * Returns a hash table list of all submissions for a given cohort. Response documentation
 * can be found on the GET /mod/submissions?cohortId={} endpoint.
 * @param {number} CohortID the id of the desired cohort
 * @returns {Promise} a promise that resolves to a table of submissions
 */
const getSubmissionsByCohort = async (CohortID) => {
  return db.transaction(async (trx) => {
    try {
      const cohorts = await trx('Cohorts').where({ ID: CohortID });
      // If the cohort ID is invalid, this will throw a 404 error
      if (cohorts.length <= 0) throw new Error('NotFound');

      const data = await dbOps.getAllSubmissionsByCohort(trx, CohortID);
      return formatCohortSubmissions(data);
    } catch (err) {
      throw new Error(err.message);
    }
  });
};

/**
 * Attempts to update the submission status of a given post.
 * @param {number} ID the id of the submission to update
 * @param {Object} changes the desired changes for the given submission
 * @param {string} changes.Status a string containing one of the following flags: 'APPROVED', 'REJECTED'
 * @returns {Promise} returns a promise that resolves to a count of updated rows
 */
const moderatePost = (ID, changes) => {
  return db('Submissions').where({ ID }).update(changes);
};

/**
 * A database transaction that runs a series of processes on the server. This should be run
 * every wednesday night after children have assigned points to generate matchups. This is
 * essentially a saga-patterned transaction with rollback.
 * 1. Gets a list of all submissions, formats, and sorts them by squad
 * 2. Generates 4 matchups for each squad for children to vote on the following day
 */
const generateFaceoffs = () => {
  return db.transaction(async (trx) => {
    try {
      const data = await faceoff.getSubmissionsWithPoints(trx);
      const formattedData = faceoff.formatPointSums(data);
      const squads = faceoff.sortBySquad(Object.values(formattedData));
      const matchups = faceoff.groupOnPoints(squads);
      const IDs = await trx('Faceoffs').insert(matchups).returning('ID');
      console.log(IDs)
      return IDs;
    } catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
};

const generateVSequence = () =>{
  return db.transaction(async (trx) =>{
    try {
      let data = await faceoff.getSubmissionsWithPoints(trx);
      let foData = await ballot.getfaceOffData(trx);
      let squads = ballot.groupBySquad(foData);
      let childBallots = ballot.VSequence(squads, data);

      for(let childNum in childBallots){
          let votes = Object.assign(childBallots[childNum])
          await trx('Children')
          .where({ID: childNum})
          .update({
            Ballots: votes,
          })
      }
      return childBallots
    }
    catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
};
/**
 * A database transaction that can be triggered to run a series of processes on the server.
 * This should be run at the end of every week after the children have voted:
 * 1. Tallies up the votes for each faceoff
 * 2. Updates the Faceoffs table with the victor information
 * 3. Updates the Teams and Squads tables with the winner and points totals
 */
const calculateResultsForTheWeek = () => {
  return db.transaction(async (trx) => {
    try {
      const results = await result.countVotes(trx);
      const squadTotals = await result.updateFaceoffs(trx, results);
      await result.updateTeamsAndSquads(trx, squadTotals);
    } catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
};

/**
 * A database transaction that resets the read, write, and draw booleans
 * on the first occurence of the selected user's Submission (usually user id 1)
 * and deletes the corresponding Writing and Drawing.
 * For development and user testing only
 */
const resetTestUserSubs = (childId) => {
  return db.transaction(async (trx) => {
    try {
      // Reset submission booleans
      await trx('Submissions')
        .where({ID: childId})
        .first()
        .update({'HasRead': false, 'HasWritten': false, 'HasDrawn': false});
      // Get the submission info
      const submission = await trx('Submissions')
        .where({ID: childId})
        .first();
      // Delete Writing and Drawing for this submission
      await trx('Writing').where({SubmissionID: submission.ID}).del()
      await trx('Drawing').where({SubmissionID: submission.ID}).del()
    } catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
}

/**
 * A database transaction that sets the read, write, and draw booleans
 * true on first occurence of the selected user's Submission (usually user id 1)
 * and adds the corresponding Writing and Drawing.
 * For development and user testing only
 */
const generateTestUserSubs = (childId) => {
  return db.transaction(async (trx) => {
    try {
      // Reset submission booleans
      await trx('Submissions')
        .where({ID: childId})
        .first()
        .update({'HasRead': true, 'HasWritten': true, 'HasDrawn': true});
      // Get the submission info
      const submission = await trx('Submissions')
        .where({ID: childId})
        .first();
      // Add Writing and Drawing for this submission
      for (let w in testUserSubmissions(submission.ID).writing) {
        await trx('Writing').insert(testUserSubmissions(submission.ID).writing[w]);
      }
      await trx('Drawing').insert(testUserSubmissions(submission.ID).drawing);
    } catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
}

/**
 * A database transaction that gets information about number of rows
 * and various stats in the DB for user testing purposes
 */
const getTableInfo = (childId) => {
  return db.transaction(async (trx) => {
    try {
      const submission = await trx('Submissions')
        .where({ID: childId})
        .first();
      const numSubmissions = await trx('Submissions').count();
      const numWritings = await trx('Writing').count();
      const numDrawings = await trx('Drawing').count();
      const numFaceoffs = await trx('Faceoffs').count();
      const numSquads = await trx('Squads').count();
      const numTeams = await trx('Teams').count();
      const numVotes = await trx('Votes').count();
      const numPoints = await trx('Points')
        .where({MemberID: childId})
        .count();

      return {
        hasRead: submission.HasRead,
        hasDrawn: submission.HasDrawn,
        hasWritten: submission.HasWritten,
        numSubmissions: Number(numSubmissions[0].count),
        numWritings: Number(numWritings[0].count),
        numDrawings: Number(numDrawings[0].count),
        numFaceoffs: Number(numFaceoffs[0].count),
        numSquads: Number(numSquads[0].count),
        numTeams: Number(numTeams[0].count),
        numVotes: Number(numVotes[0].count),
        numPoints: Number(numPoints[0].count),
      }
    } catch (err) {
      console.log({ err: err.message });
      throw new Error(err.message);
    }
  });
}

module.exports = {
  clusterGeneration,
  getCohorts,
  addCohort,
  getSubmissionsByCohort,
  moderatePost,
  generateFaceoffs,
  calculateResultsForTheWeek,
  generateVSequence,
  resetTestUserSubs,
  generateTestUserSubs,
  getTableInfo
};

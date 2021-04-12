
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('Faceoffs').insert([
    {ID: 1, Points: 170, Type: 'WRITING', SubmissionID1: 1, SubmissionID2: 3, SquadID: 1, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 2, Points: 65, Type: 'WRITING', SubmissionID1: 2, SubmissionID2: 4, SquadID: 1, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 3, Points: 85, Type: 'DRAWING', SubmissionID1: 1, SubmissionID2: 3, SquadID: 1, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 4, Points: 80, Type: 'DRAWING', SubmissionID1: 2, SubmissionID2: 4, SquadID: 1, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 5, Points: 170, Type: 'WRITING', SubmissionID1: 5, SubmissionID2: 7, SquadID: 2, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 6, Points: 65, Type: 'WRITING', SubmissionID1: 6, SubmissionID2: 8, SquadID: 2, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 7, Points: 85, Type: 'DRAWING', SubmissionID1: 5, SubmissionID2: 7, SquadID: 2, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
    {ID: 8, Points: 80, Type: 'DRAWING', SubmissionID1: 6, SubmissionID2: 8, SquadID: 2, Date: '2021-04-12 19:01:46.884419+00', VotesCasted: 0},
  ]);
};

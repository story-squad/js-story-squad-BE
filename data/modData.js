/* 
* Data used for mod endpoints, auto-submissions.
* Should match initial seed data for user with id: 1
*/

const testUserSubmissions = (SubmissionID) => {
  return {
    writing: [
      { URL: 'https://picsum.photos/id/1/400', PageNum: 1, SubmissionID },
      { URL: 'https://picsum.photos/id/101/400', PageNum: 2, SubmissionID }
    ],
    drawing: {URL: 'https://picsum.photos/id/201/400', SubmissionID }
  }
}

const testUserPoints = [
  { WritingPoints: 50, DrawingPoints: 15, MemberID: 1, SubmissionID: 1 },
  { WritingPoints: 25, DrawingPoints: 10, MemberID: 1, SubmissionID: 2 },
];


module.exports = {
  testUserSubmissions,
  testUserPoints
}

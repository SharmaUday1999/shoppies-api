import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Select: "ALL_ATTRIBUTES",
  };
  const result = await dynamoDb.scan(params);
  //create response body
  var res = [];

  //this aggregates all of the nominations into a list with the nomination count of each movie nominated
  result.Items.forEach(function (item) {
    if (movieExists(item.movieId, res)) {
      var requiredIndex = res.findIndex((el) => el.movieId === item.movieId);
      if (requiredIndex >= 0) {
        res[requiredIndex].nominationCount++;
      }
    } else {
      res.push({
        movieName: item.movieName,
        movieId: item.movieId,
        nominationCount: 1,
      });
    }
  });

  return res;
});

function movieExists(movieId, arr) {
  return arr.some(function (el) {
    return el.movieId == movieId;
  });
}

//from lecture
const db = require('./DBConnection');
const Review = require('./models/Review');

function getUserReviews(userId) {
  return db.query('SELECT * FROM review WHERE r_usr_id=?', [userId]).then(({results}) => {
    return results.map(review => new Review(review)); ;
  });
}

function getUserReviewsByType(userId, type) {
  return db.query('SELECT * FROM review WHERE r_usr_id=? AND r_type=?', [userId, type]).then(({results}) => {
    return results.map(review => new Review(review)); ;
  });
}

function getUserReviewById(userId, reviewId) {
  return db.query('SELECT * FROM review WHERE r_usr_id=? AND r_id=?', [userId, reviewId]).then(({results}) => {
    const review = new Review(results[0]);
    if (review) { // we found our review
      return review;
    }
    else { // if no review with same user id and review id
      throw new Error("No such review");
    }
  });
}

function getUserReviewByMbid(userId, mbid) {
  return db.query('SELECT * FROM review WHERE r_usr_id=? AND r_mbid=?', [userId, mbid]).then(({results}) => {
    const review = new Review(results[0]);
    if (review) { // we found our review
      return review;
    }
    else { // if no review with same user id and review id
      throw new Error("No such review");
    }
  });
}

function createUserReview(userId, review) {
  return db.query('SELECT * FROM review WHERE r_usr_id=? AND r_mbid=?', [userId, review.mbid]).then(({results}) => {
    if (results.length > 0) { // we already have this review, use put instead
      throw new Error("Review already exists");
    }
   
    // new review (good)
    return db.query('INSERT INTO review (r_type, r_mbid, r_usr_id, r_score, r_liked, r_method, r_review) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [review.type, review.mbid, userId, review.score, review.liked, review.method, review.review]).then(({results}) => {
      return getUserReviewById(userId, results.insertId);
    });
  });
}

function updateUserReview(userId, review, reviewId) {
  return db.query('SELECT * FROM review WHERE r_usr_id=? AND r_id=?', [userId, reviewId]).then(({results}) => {
    const foundReview = new Review(results[0]);
    if (foundReview) { // we found our review
    
      //if method is a field in the new review do the first one, else the second
      if(review.method) {
        return db.query(`UPDATE review SET r_score = ${review.score}, r_liked = ${review.liked}, r_method  = ${review.method}, r_review = "${review.review}" WHERE r_id = ${reviewId}`).then(({results}) => {
          return getUserReviewById(userId, reviewId);
        });
      } else {
        return db.query(`UPDATE review SET r_score = ${review.score}, r_liked = ${review.liked}, r_review = "${review.review}" WHERE r_id = ${reviewId}`).then(({results}) => {
          return getUserReviewById(userId, reviewId);
        });
      }
      
    }
    else { // if no review with same user id and review id
      throw new Error("No such review");
    }
  });
}


module.exports = {
  getUserReviews: getUserReviews,
  getUserReviewsByType: getUserReviewsByType,
  getUserReviewById: getUserReviewById,
  getUserReviewByMbid: getUserReviewByMbid,
  createUserReview: createUserReview,
  updateUserReview: updateUserReview
};

//from lecture
module.exports = class {
  constructor(data) {
    this.id = data.r_id;
    this.type = data.r_type;
    this.mbid = data.r_mbid;
    this.user_id = data.r_usr_id;
    this.score = data.r_score;
    this.liked = data.r_liked;
    this.method = data.r_method;
    this.review = data.r_review;
    this.time = data.r_time;
  }
};
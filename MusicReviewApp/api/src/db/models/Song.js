//from lecture
module.exports = class {
  constructor(data) {
    this.id = data.s_id;
    this.playlist_id = data.s_plist_id;
    this.user_id = data.s_usr_id;
    this.mbid = data.s_mbid;
  }
}
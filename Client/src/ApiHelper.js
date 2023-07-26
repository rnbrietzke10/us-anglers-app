import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class Api {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}` };
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  // Signup user
  static async createUser(userData) {
    let res = await this.request(`auth/register`, userData, 'post');
    console.log(res);
    return res.token;
  }

  // login user
  static async loginUser(userData) {
    let res = await this.request('auth/token', userData, 'post');
    this.token = res.token;
    let allUserInfo = await this.request(`users/${userData.username}`);
    localStorage.setItem('user', JSON.stringify(allUserInfo.user));
    localStorage.setItem('token', this.token);
    console.log('All User Data: ', allUserInfo.user);

    return { allUserInfo, token: this.token };
  }

  // Update User
  static async updateUser(userData, username, token) {
    this.token = token;
    let res = await this.request(`users/${username}`, userData, 'patch');
    console.log('UpdateUser res: ', res);
    return res.user;
  }

  // Create post
  //User data should contain post and user token
  static async createPost(userData, token) {
    this.token = token;
    let res = await this.request(`posts/new`, userData, 'post');
    console.log(res);
    return res;
  }

  // Create post
  //User data should contain post and user token
  static async deletePost(userData, token) {
    this.token = token;
    let res = await this.request(`posts/delete`, userData, 'delete');
    console.log(res);
    return res;
  }

  // Get posts
  static async getPosts() {
    let res = await this.request(`posts`);
    return res.posts;
  }

  // Create comment
  //User data should contain comment and user token
  static async createComment(userData, token) {
    this.token = token;
    let res = await this.request(`comments/new`, userData, 'post');
    console.log(res);
    return res;
  }

  // Get Comments
  static async getComments(postId, token) {
    this.token = token;
    let res = await this.request(`posts/${postId}/comments`);
    return res.comments;
  }

  // Add like
  // Should contain postId or commentId, user token and the users id
  // postId/commentId will be id in the arguments
  // idType will specify wether it is a post or comment
  static async addLike(data, idType, token) {
    this.token = token;
    const { postId } = data;
    let res = await this.request(`${idType}/${postId}/like`, data, 'post');
  }

  static async getLikes(postId, idType, token) {
    this.token = token;
    let res = await this.request(`${idType}/${postId}/like`);
    console.log('res in getLikes: ', res);

    const likesUserIds = res.likes.map(like => like.userId);
    console.log('likeUserIds: ', likesUserIds);
    return likesUserIds;
  }
}

// for now, put token ("testuser" / "password" on class)
// Api.token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
//   'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
//   'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

export default Api;

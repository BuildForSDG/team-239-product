import Auth from '../controllers/authController';
import { validateSignUp, validateSignIn } from '../middlewares/authentication';
import Communities from '../controllers/communityController';
import { verifyLoggedInUser, verifyAdminUser } from '../middlewares/authorizations';

/**
 *
 * @param {*} app
 */
const routes = (app) => {
  app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to our API' }));

  /**
   * AUTHENTICATION ENDPOINTS
   */
  app.post('/api/auth/sign_up', validateSignUp, Auth.signUp);
  app.post('/api/auth/sign_in', validateSignIn, Auth.signIn);

  /**
   * COMMUNITIES' ENDPOINTS
   */
  app.post('/api/communities', verifyLoggedInUser, verifyAdminUser, Communities.create);
  app.get('/api/communities', Communities.fetchAll);
  app.get('/api/communities/:communityId', Communities.fetchOne);
  app.put('/api/communities/:communityId', Communities.update);
  app.delete('/api/communities/:communityId', Communities.delete);
};

export default routes;

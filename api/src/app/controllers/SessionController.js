import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import User from '../models/user';

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) res.status(404).json({ error: 'User not found' });

      if (!(await user.checkPassword(password)))
        res.status(401).json({ error: 'Password does not match' });

      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new SessionController();
import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const result = await authService.register(email, password, fullName);
      res.json(result);
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async getMe(req, res) {
    res.json({ user: req.user });
  },

  async updateProfile(req, res) {
    try {
      const { fullName, password } = req.body;
      const user = await authService.updateProfile(req.user.id, fullName, password);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Profile update failed' });
    }
  },
};

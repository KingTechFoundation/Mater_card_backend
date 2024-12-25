import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'none', // Allow the cookie to be sent with cross-site requests
      secure: true, // Always send the cookie over HTTPS, even in development
    });

    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    res.status(500).json({ message: 'Failed to generate token' });
  }
};

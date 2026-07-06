import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            res.status(400);
            throw new Error('Please provide name, email and password');
        }

        const existingUser = await User.findOne( { email });
        if(existingUser) {
            res.status(409);
            throw new Error('An account with this email already exists');
        }

        const user = await User.create({ name, email, password });
        
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
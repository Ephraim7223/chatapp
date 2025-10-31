import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

export const needsRehash = async (hashedPassword) => {
    try {
        const rounds = await bcrypt.getRounds(hashedPassword);
        return rounds < SALT_ROUNDS;
    } catch (error) {
        return false;
    }
};

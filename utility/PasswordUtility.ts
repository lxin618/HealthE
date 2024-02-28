import bcrypt from 'bcrypt'

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const ValidatePassowrd = async (savedPassword: string, providedPassword: string, salt: string) => {
    return await GeneratePassword(providedPassword, salt) == savedPassword
}
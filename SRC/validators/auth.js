import {z} from 'zod'

export const regValidator = z.object({
    userName : z.string()
                .min(4, {message: "should not be less than 4 characters"})
                .max(14,{message: "should not be more than 14 characters"}),
    firstName  : z.string(),
    lastName: z.string(),
    phoneNumber: z.string()
                   .min(10, {message: "should not be less than 10 characters"})
                   .max(11,{message: "should not be more than 11 characters"}),
    DOB : z.string(),
    password : z.string(),
    email : z.string(),
    gender : z.string(),
})

export const loginValidator = z.object({
    
})
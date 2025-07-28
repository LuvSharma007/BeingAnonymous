import z, { success } from 'zod'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username , code} = await request.json();

        const decodedUsernamed = decodeURIComponent(username)
        const user =  await UserModel.findOne({username:decodedUsernamed})
        if(!user){
            return Response.json(
            {
                success:false,
                message:"user not foundr"
            },
            {status:400}
        )
        }

        const isCodeValid = user.verifyCode === code 
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()


        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json(
            {
                success:true,
                message:"Account verified"
            },
            {status:200}
        )
        }else if(!isCodeNotExpired){
            return Response.json(
            {
                success:false,
                message:"Code is expired , sigup again"
            },
            {status:400})
        }else if(isCodeValid !== isCodeNotExpired){
            return Response.json(
            {
                success:false,
                message:"Jada chalak mat ban , theek hai , code invalid , signup again"
            },
            {status:400})
        }
    } catch (error) {
        console.log('Error Verifying user',error);
        return Response.json(
            {
                success:false,
                message:"Error verifying user"
            },
            {status:500}
        )
    }
}


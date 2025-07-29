import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Unauthorised Access',
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},            // match the user
            {$unwind:"$messages"},                   // seprate all messages from array and make them documents with same id
            {$sort:{ 'messages.createdAt': -1 }},    // it will sort the messages according to creation , means newly created mesasges will be at top
            {$limit: 10 },                            //  mimit to latest 10 messages
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        if(!user || user.length === 0){
            return Response.json(
            {
                success: false,
                message: 'Not getting Messages',
            },
            { status: 401 }
        );
        }

        return Response.json(
            {
                message: user[0].messages,
            },
            { status: 200 }
        );
    } catch (error) {
         return Response.json(
            {
                success: false,
                message: 'Error getting messages',
            },
            { status: 500 }
        );
    }



    

}
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request:Request){
    dbConnect()
    const {username , content} = await request.json();
    try {
        const user = await UserModel.findOne({username}).exec();

        if(!user){
            return Response.json({
            success:true,
            message: 'User not found'},
            { status: 404 }
        ); 
        }

        // check if user is accepting messages or not
        if(!user.isAcceptingMessage){
            return Response.json(
                {message:'User is not accepting messages',success:false},
                {status:403}
            );
        }

        const newMessage = {content , createdAt: new Date()};

        // push new message to db
        user.messages.push(newMessage as Message);
        await user.save()

        return Response.json(
        { message: 'Message sent successfully', success: true },
        { status: 201 }
        );
        
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
    );
    }
}
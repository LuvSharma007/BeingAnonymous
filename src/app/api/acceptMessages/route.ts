import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// acceptMessage or not

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log(session);
    
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

    const userId = user?._id
    const { acceptMessage } = await request.json()

    try {
        const user = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessage
        },
            { new: true }
        )
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'user not found',
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'messages acceptance status update successfully',
                user
            },
            { status: 200 }
        );



    } catch (error) {
        console.log("failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: 'failed to update user status to accept messages',
            },
            { status: 500 }
        );
    }

}

export async function GET(request: Request) {
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

    const userId = user?._id;
    
    try {
        const foundUser = await UserModel.findById({ userId });

    if (!user) {
        return Response.json(
            {
                success: false,
                message: 'user not found',
            },
            { status: 404 }
        );
    }

    return Response.json(
        {
            success: true,
            isAcceptingMesaages:foundUser?.isAcceptingMessage,
            message: 'user not found',
        },
        { status: 200 }
    );
    } catch (error) {
        console.log("Error is getting message acceptance status");
        return Response.json(
            {
                success: false,
                message: 'Error is getting message acceptance status',
            },
            { status: 500 }
        );
        
    }
}




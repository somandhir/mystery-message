import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }
    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the message",
        },
        { status: 403 },
      );
    }
    const newMessage = { content, createdAt: new Date() };
    await UserModel.updateOne(
      { username },
      { $push: { messages: newMessage } },
    );

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in adding messages for the user : ", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

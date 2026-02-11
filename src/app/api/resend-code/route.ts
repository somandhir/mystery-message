import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account is already verified" },
        { status: 400 },
      );
    }

    const newVerifyCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Valid for 1 hour

    user.verifyCode = newVerifyCode;
    user.verifyCodeExpiry = expiryDate;
    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.email,
      username,
      newVerifyCode,
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Verification code resent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resending code:", error);
    return NextResponse.json(
      { success: false, message: "Error resending code" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

let blogs: { id: number; title: string; content: string }[] = [];

export async function GET() {
  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title: string = body.title;
    const content: string = body.content;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    const newBlog = {
      id: blogs.length + 1,
      title,
      content,
    };

    blogs.push(newBlog);

    return NextResponse.json({ blog: newBlog });
  } catch (error) {
    console.error("Error in /api/blogs:", error);
    return NextResponse.json(
      { error: "Failed to save blog", details: String(error) },
      { status: 500 }
    );
  }
}
